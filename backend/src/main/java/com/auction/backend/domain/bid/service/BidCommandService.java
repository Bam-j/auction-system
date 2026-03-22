package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.exception.InvalidBidException;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.service.AuctionQueryService;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.exception.SelfPurchaseException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BidCommandService {

    private final BidRepository bidRepository;
    private final UserQueryService userQueryService;
    private final AuctionQueryService auctionQueryService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final NotificationCommandService notificationCommandService;

    private static final String AUCTION_PRICE_KEY = "auction:price:";

    //입찰 동시성 제어를 위한 Lua 스크립트
    private static final String BID_LUA_SCRIPT =
            "local current_price = redis.call('get', KEYS[1]) " +
                    "if not current_price then " +
                    "  redis.call('set', KEYS[1], ARGV[2]) " +
                    "  current_price = ARGV[2] " +
                    "end " +
                    "if tonumber(ARGV[1]) >= tonumber(current_price) + tonumber(ARGV[3]) then " +
                    "  redis.call('set', KEYS[1], ARGV[1]) " +
                    "  return 1 " +
                    "else " +
                    "  return 0 " +
                    "end";

    //입찰 생성
    public Long createBid(Long userId, BidCreateRequest request) {
        log.info("Creating bid for user: {}, auction: {}, price: {}",
                userId, request.getAuctionId(), request.getBidPrice());

        User user = userQueryService.getUser(userId);
        Auction auction = auctionQueryService.getAuction(request.getAuctionId());

        if (auction.getUser().getUserId().equals(userId)) {
            throw new SelfPurchaseException("자신의 경매 상품에는 입찰할 수 없습니다.");
        }

        //입찰 동시성 제어
        String redisKey = AUCTION_PRICE_KEY + auction.getAuctionId();

        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
        redisScript.setScriptText(BID_LUA_SCRIPT);
        redisScript.setResultType(Long.class);

        Long result = redisTemplate.execute(redisScript,
                Collections.singletonList(redisKey),
                request.getBidPrice(),
                auction.getCurrentPrice(),
                auction.getMinBidIncrement());

        if (result == null || result == 0) {
            Object currentRedisPrice = redisTemplate.opsForValue().get(redisKey);
            log.warn("Bid failed. requestPrice: {}, currentRedisPrice: {}", request.getBidPrice(), currentRedisPrice);
            throw new InvalidBidException("입찰 가격이 현재가보다 낮거나 최소 입찰 단위를 충족하지 못했습니다.");
        }

        auction.updateCurrentPrice(request.getBidPrice());

        // 알림 전송: 이전 최고 입찰자에게 패찰 알림
        bidRepository.findTopByAuctionOrderByBidPriceDesc(auction)
                .ifPresent(previousBid -> {
                    if (!previousBid.getUser().getUserId().equals(userId)) {
                        notificationCommandService.send(
                                previousBid.getUser(),
                                com.auction.backend.domain.notification.entity.NotificationType.OUTBID,
                                String.format("[%s] 상품에 더 높은 입찰가가 등록되어 패찰되었습니다.", auction.getProduct().getProductName()),
                                auction.getProduct().getProductId()
                        );
                    }
                });

        Bid bid = Bid.createBid(user, auction, request.getBidPrice());
        bidRepository.save(bid);

        return bid.getBidId();
    }
}
