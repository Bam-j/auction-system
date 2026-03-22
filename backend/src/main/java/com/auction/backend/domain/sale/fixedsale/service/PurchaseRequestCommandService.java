package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.fixedsalesorder.repository.FixedSaleOrderRepository;
import com.auction.backend.domain.fixedsalesorder.service.FixedSalesOrderCommandService;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.exception.InsufficientStockException;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.exception.SelfPurchaseException;
import com.auction.backend.global.exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseRequestCommandService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final PurchaseRequestQueryService purchaseRequestQueryService;
    private final FixedSaleQueryService fixedSaleQueryService;
    private final UserQueryService userQueryService;
    private final FixedSaleOrderRepository fixedSaleOrderRepository;
    private final FixedSalesOrderCommandService fixedSalesOrderCommandService;
    private final NotificationCommandService notificationCommandService;

    //구매 요청 생성
    public Long createPurchaseRequest(Long userId, PurchaseRequestCreateRequest request) {
        log.info("Creating purchase request for user: {}, fixedSale: {}, quantity: {}",
                userId, request.getFixedSaleId(), request.getQuantity());

        User user = userQueryService.getUser(userId);

        FixedSale fixedSale = fixedSaleQueryService.getFixedSale(request.getFixedSaleId());

        if (fixedSale.getUser().getUserId().equals(userId)) {
            throw new SelfPurchaseException("자신의 상품은 구매할 수 없습니다.");
        }

        if (fixedSale.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("재고가 부족합니다.");
        }

        PurchaseRequest purchaseRequest = PurchaseRequest.createPurchaseRequest(user, fixedSale, request.getQuantity());
        purchaseRequestRepository.save(purchaseRequest);

        // 알림 전송: 판매자에게 구매 요청 알림
        notificationCommandService.send(
                fixedSale.getUser(),
                com.auction.backend.domain.notification.entity.NotificationType.PURCHASE_REQUEST_RECEIVED,
                String.format("[%s] 상품에 새로운 구매 요청이 들어왔습니다.", fixedSale.getProduct().getProductName()),
                fixedSale.getProduct().getProductId()
        );

        return purchaseRequest.getPurchaseRequestId();
    }

    //구매 요청 승인
    public void approvePurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestQueryService.getRequest(requestId);

        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("판매자만 요청을 수락할 수 있습니다.");
        }

        if (SalesStatus.SOLD_OUT.equals(request.getFixedSale().getProduct().getSalesStatus())) {
            throw new InsufficientStockException("이미 판매 완료/품절된 상품입니다.");
        }

        request.approve();
        request.getFixedSale().decreaseStock(request.getQuantity());
        fixedSalesOrderCommandService.createFixedSaleOrder(request);

        // 알림 전송: 구매자에게 승인 알림
        notificationCommandService.send(
                request.getUser(),
                com.auction.backend.domain.notification.entity.NotificationType.PURCHASE_REQUEST_APPROVED,
                String.format("[%s] 상품의 구매 요청이 승인되었습니다.", request.getFixedSale().getProduct().getProductName()),
                request.getFixedSale().getProduct().getProductId()
        );
    }

    //구매 요청 거부
    public void rejectPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestQueryService.getRequest(requestId);

        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("판매자만 요청을 거절할 수 있습니다.");
        }

        request.reject();

        // 알림 전송: 구매자에게 거절 알림
        notificationCommandService.send(
                request.getUser(),
                com.auction.backend.domain.notification.entity.NotificationType.PURCHASE_REQUEST_REJECTED,
                String.format("[%s] 상품의 구매 요청이 거절되었습니다.", request.getFixedSale().getProduct().getProductName()),
                request.getFixedSale().getProduct().getProductId()
        );
    }

    //송신한 구매 요청 취소
    public void cancelPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestQueryService.getRequest(requestId);

        if (!request.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("본인의 요청만 취소할 수 있습니다.");
        }

        request.reject();
    }
}
