package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.entity.InstantBuyRequest;
import com.auction.backend.domain.sale.auction.exception.InstantBuyNotAvailableException;
import com.auction.backend.domain.sale.auction.repository.InstantBuyRequestRepository;
import com.auction.backend.global.exception.InvalidSalesStatusException;
import com.auction.backend.global.exception.SelfPurchaseException;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class InstantBuyRequestCommandService {

    private final InstantBuyRequestRepository instantBuyRequestRepository;
    private final InstantBuyRequestQueryService instantBuyRequestQueryService;
    private final AuctionQueryService auctionQueryService;
    private final UserQueryService userQueryService;
    private final NotificationCommandService notificationCommandService;
    private final com.auction.backend.domain.bid.repository.BidRepository bidRepository;

    //즉시 구매 요청 생성
    public Long createInstantBuyRequest(Long userId, InstantBuyCreateRequest request) {
        log.info("Creating instant buy request for user: {}, auction: {}",
                userId, request.getAuctionId());

        User user = userQueryService.getUser(userId);
        Auction auction = auctionQueryService.getAuction(request.getAuctionId());

        if (auction.getUser().getUserId().equals(userId)) {
            throw new SelfPurchaseException("자신의 경매 상품은 즉시 구매할 수 없습니다.");
        }

        if (auction.getInstantPurchasePrice() == null) {
            throw new InstantBuyNotAvailableException("즉시 구매가 가능한 경매 상품이 아닙니다.");
        }

        InstantBuyRequest instantBuyRequest = InstantBuyRequest.createInstantBuyRequest(user, auction);
        instantBuyRequestRepository.save(instantBuyRequest);

        // 알림 전송: 판매자에게 즉시 구매 요청 알림
        notificationCommandService.send(
                auction.getUser(),
                com.auction.backend.domain.notification.entity.NotificationType.INSTANT_BUY_REQUEST_RECEIVED,
                String.format("[%s] 상품에 새로운 즉시 구매 요청이 들어왔습니다.", auction.getProduct().getProductName()),
                auction.getProduct().getProductId()
        );

        return instantBuyRequest.getInstantBuyRequestId();
    }

    //즉시 구매 요청 승인
    public void approveInstantBuyRequest(Long userId, Long requestId) {
        InstantBuyRequest request = instantBuyRequestQueryService.getRequest(requestId);

        if (!request.getAuction().getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("판매자만 요청을 수락할 수 있습니다.");
        }

        if (SalesStatus.SOLD_OUT.equals(request.getAuction().getProduct().getSalesStatus()) ||
                SalesStatus.INSTANT_BUY.equals(request.getAuction().getProduct().getSalesStatus())) {
            throw new InvalidSalesStatusException("이미 낙찰 또는 판매 완료된 상품입니다.");
        }

        request.approve();
        request.getAuction().getProduct().instantBuy();

        // 알림 전송: 구매자에게 승인 알림
        notificationCommandService.send(
                request.getUser(),
                com.auction.backend.domain.notification.entity.NotificationType.INSTANT_BUY_REQUEST_APPROVED,
                String.format("[%s] 상품의 즉시 구매 요청이 승인되었습니다.", request.getAuction().getProduct().getProductName()),
                request.getAuction().getProduct().getProductId()
        );

        // 알림 전송: 기존 입찰자들에게 패찰 알림
        java.util.List<com.auction.backend.domain.bid.entity.Bid> bids = bidRepository.findByAuctionOrderByBidPriceDesc(request.getAuction());
        java.util.Set<Long> notifiedUserIds = new java.util.HashSet<>();
        for (com.auction.backend.domain.bid.entity.Bid bid : bids) {
            Long bidderId = bid.getUser().getUserId();
            if (!notifiedUserIds.contains(bidderId)) {
                notificationCommandService.send(
                        bid.getUser(),
                        com.auction.backend.domain.notification.entity.NotificationType.OUTBID,
                        String.format("[%s] 상품이 다른 사람에 의해 즉시 구매되어 패찰되었습니다.", request.getAuction().getProduct().getProductName()),
                        request.getAuction().getProduct().getProductId()
                );
                notifiedUserIds.add(bidderId);
            }
        }
    }

    //즉시 구매 요청 거부
    public void rejectInstantBuyRequest(Long userId, Long requestId) {
        InstantBuyRequest request = instantBuyRequestQueryService.getRequest(requestId);

        if (!request.getAuction().getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("판매자만 요청을 거절할 수 있습니다.");
        }

        request.reject();

        // 알림 전송: 구매자에게 거절 알림
        notificationCommandService.send(
                request.getUser(),
                com.auction.backend.domain.notification.entity.NotificationType.INSTANT_BUY_REQUEST_REJECTED,
                String.format("[%s] 상품의 즉시 구매 요청이 거절되었습니다.", request.getAuction().getProduct().getProductName()),
                request.getAuction().getProduct().getProductId()
        );
    }
}
