package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.notification.entity.NotificationType;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.service.ProductCommandService;
import com.auction.backend.domain.sale.auction.dto.AuctionRegisterRequest;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuctionCommandService {

    private final AuctionRepository auctionRepository;
    private final UserQueryService userQueryService;
    private final ProductCommandService productCommandService;
    private final NotificationCommandService notificationCommandService;
    private final BidRepository bidRepository;

    //경매 상품 등록
    public Long registerAuction(Long userId, AuctionRegisterRequest request, String imageUrl) {
        log.info("Registering auction for user: {}, product: {}", userId, request.getProductName());

        User user = userQueryService.getUser(userId);
        Product product = productCommandService.createProduct(
                user,
                request.getProductName(),
                request.getDescription(),
                imageUrl,
                request.getCategory()
        );

        Auction auction = Auction.createAuction(
                product,
                user,
                request.getEndedAt(),
                request.getStartPrice(),
                request.getMinBidIncrement(),
                request.getInstantPurchasePrice(),
                request.getPriceUnit()
        );
        auctionRepository.save(auction);

        return auction.getAuctionId();
    }

    //경매 종료 처리
    public void endAuction(Auction auction) {
        log.info("Ending auction: {}", auction.getAuctionId());

        // 상품 상태 변경 (SOLD_OUT)
        auction.getProduct().soldOut();

        // 판매자에게 기한 마감 알림
        notificationCommandService.send(
                auction.getUser(),
                NotificationType.AUCTION_EXPIRED,
                String.format("[%s] 상품의 경매 기한이 마감되었습니다.", auction.getProduct().getProductName()),
                auction.getProduct().getProductId()
        );

        // 최고 입찰자(낙찰자)에게 낙찰 알림
        bidRepository.findTopByAuctionOrderByBidPriceDesc(auction)
                .ifPresent(winnerBid -> {
                    notificationCommandService.send(
                            winnerBid.getUser(),
                            NotificationType.BID_WON,
                            String.format("[%s] 상품 경매에 낙찰되셨습니다! 최종 낙찰가: %d",
                                    auction.getProduct().getProductName(), winnerBid.getBidPrice()),
                            auction.getProduct().getProductId()
                    );
                });
    }
}
