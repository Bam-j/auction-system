package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.fixedsalesorder.entity.FixedSalesOrder;
import com.auction.backend.domain.fixedsalesorder.repository.FixedSalesOrderRepository;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.exception.InsufficientStockException;
import com.auction.backend.global.exception.SelfPurchaseException;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.exception.ResourceNotFoundException;
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
    private final FixedSaleRepository fixedSaleRepository;
    private final UserRepository userRepository;
    private final FixedSalesOrderRepository fixedSalesOrderRepository;

    //구매 요청 생성
    public Long createPurchaseRequest(Long userId, PurchaseRequestCreateRequest request) {
        log.info("Creating purchase request for user: {}, fixedSale: {}, quantity: {}",
                userId, request.getFixedSaleId(), request.getQuantity());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        FixedSale fixedSale = fixedSaleRepository.findById(request.getFixedSaleId())
                .orElseThrow(() -> new ResourceNotFoundException("판매 정보를 찾을 수 없습니다."));

        if (fixedSale.getUser().getUserId().equals(userId)) {
            throw new SelfPurchaseException("자신의 상품은 구매할 수 없습니다.");
        }

        if (fixedSale.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("재고가 부족합니다.");
        }

        PurchaseRequest purchaseRequest = PurchaseRequest.createPurchaseRequest(
                user,
                fixedSale,
                request.getQuantity()
        );

        purchaseRequestRepository.save(purchaseRequest);

        return purchaseRequest.getPurchaseRequestId();
    }

    //구매 요청 승인
    public void approvePurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = getRequest(requestId);

        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("판매자만 요청을 수락할 수 있습니다.");
        }

        if (SalesStatus.SOLD_OUT.equals(request.getFixedSale().getProduct().getSalesStatus())) {
            throw new InsufficientStockException("이미 품절된 상품입니다.");
        }

        request.approve();
        request.getFixedSale().decreaseStock(request.getQuantity());

        FixedSalesOrder order = FixedSalesOrder.createOrder(
                request,
                request.getFixedSale().getPrice(),
                request.getQuantity()
        );
        fixedSalesOrderRepository.save(order);
    }

    //구매 요청 거부
    public void rejectPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = getRequest(requestId);

        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("판매자만 요청을 거절할 수 있습니다.");
        }

        request.reject();
    }

    //송신한 구매 요청 취소
    public void cancelPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = getRequest(requestId);

        if (!request.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("본인의 요청만 취소할 수 있습니다.");
        }

        request.reject();
    }

    private PurchaseRequest getRequest(Long requestId) {
        return purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("구매 요청을 찾을 수 없습니다."));
    }
}
