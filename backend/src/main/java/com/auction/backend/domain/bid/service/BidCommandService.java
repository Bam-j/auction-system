package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.exception.InvalidBidException;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.notification.entity.NotificationType;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.service.AuctionQueryService;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.exception.SelfPurchaseException;
import com.auction.backend.global.exception.UserUnverifiedException;
import com.auction.backend.global.service.RedisLockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BidCommandService {

    private final BidRepository bidRepository;
    private final UserQueryService userQueryService;
    private final AuctionQueryService auctionQueryService;
    private final RedisLockService redisLockService;
    private final com.auction.backend.global.service.RedisRateLimitService redisRateLimitService;
    private final NotificationCommandService notificationCommandService;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    //입찰 생성
    public Long createBid(Long userId, BidCreateRequest request) {
        log.info("Creating bid for user: {}, auction: {}, price: {}",
                userId, request.getAuctionId(), request.getBidPrice());

        //사용자별 요청 빈도 제한 (1초에 최대 2회)
        redisRateLimitService.checkRateLimit("rate:bid:user:" + userId, 2, 1);

        return redisLockService.runWithLock("auction:" + request.getAuctionId(), () -> {
            User user = userQueryService.getUser(userId);

            if (!user.isVerified()) {
                throw new UserUnverifiedException("이메일 인증이 완료되지 않은 계정은 입찰할 수 없습니다.");
            }

            Auction auction = auctionQueryService.getAuction(request.getAuctionId());

            if (auction.getUser().getUserId().equals(userId)) {
                throw new SelfPurchaseException("자신의 경매 상품에는 입찰할 수 없습니다.");
            }

            // 입찰 가격 검증
            if (request.getBidPrice() < auction.getCurrentPrice() + auction.getMinBidIncrement()) {
                throw new InvalidBidException("입찰 가격이 현재가보다 낮거나 최소 입찰 단위를 충족하지 못했습니다.");
            }

            // 현재가 업데이트 및 마감 시간 연장 체크
            auction.updateCurrentPrice(request.getBidPrice());
            auction.extendEndTime();

            messagingTemplate.convertAndSend("/topic/auction/" + auction.getAuctionId(), 
                java.util.Map.of(
                    "auctionId", auction.getAuctionId(),
                    "endedAt", auction.getEndedAt().toString(),
                    "currentPrice", auction.getCurrentPrice(),
                    "highestBidderId", user.getUserId()
                )
            );

            //이전 최고 입찰자에게 패찰 알림 및 현재 최고 입찰자 확인 (알림 발송)
            bidRepository.findTopByAuctionOrderByBidPriceDesc(auction)
                    .ifPresent(previousBid -> {
                        if (previousBid.getUser().getUserId().equals(userId)) {
                            throw new InvalidBidException("이미 현재 최고 입찰자입니다.");
                        }

                        notificationCommandService.send(
                                previousBid.getUser(),
                                NotificationType.OUTBID,
                                String.format("[%s] 상품에 더 높은 입찰가가 등록되어 패찰되었습니다.", auction.getProduct().getProductName()),
                                auction.getProduct().getProductId()
                        );
                    });

            Bid bid = Bid.createBid(user, auction, request.getBidPrice());
            bidRepository.save(bid);

            return bid.getBidId();
        });
    }
}
