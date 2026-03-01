package com.auction.backend.domain.purchaserequest.service;

import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestResponse;
import com.auction.backend.domain.purchaserequest.entity.PurchaseRequest;
import com.auction.backend.domain.purchaserequest.repository.PurchaseRequestRepository;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequestStatus;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.domain.fixedsalesorder.entity.FixedSalesOrder;
import com.auction.backend.domain.fixedsalesorder.repository.FixedSalesOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseRequestService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final FixedSaleRepository fixedSaleRepository;
    private final UserRepository userRepository;
    private final FixedSalesOrderRepository fixedSalesOrderRepository;

    @Transactional
    public Long createPurchaseRequest(Long userId, PurchaseRequestCreateRequest request) {
// ... existing createPurchaseRequest method ...
        // ... 생략 (기존 코드 유지)
        log.info("Creating purchase request for user: {}, fixedSale: {}, quantity: {}", 
                userId, request.getFixedSaleId(), request.getQuantity());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        FixedSale fixedSale = fixedSaleRepository.findById(request.getFixedSaleId())
                .orElseThrow(() -> new RuntimeException("판매 정보를 찾을 수 없습니다."));

        if (fixedSale.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("자신의 상품은 구매할 수 없습니다.");
        }

        if (fixedSale.getStock() < request.getQuantity()) {
            throw new RuntimeException("재고가 부족합니다.");
        }

        PurchaseRequest purchaseRequest = PurchaseRequest.createPurchaseRequest(
                user,
                fixedSale,
                request.getQuantity()
        );

        purchaseRequestRepository.save(purchaseRequest);

        return purchaseRequest.getPurchaseRequestId();
    }

    public List<PurchaseRequestResponse> getUserPurchaseRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return purchaseRequestRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<PurchaseRequestResponse> getSellerPurchaseRequests(Long userId) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return purchaseRequestRepository.findBySeller(seller).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approvePurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("구매 요청을 찾을 수 없습니다."));

        // 판매자 확인
        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("판매자만 요청을 수락할 수 있습니다.");
        }

        request.approve();
        
        // 재고 감소
        request.getFixedSale().decreaseStock(request.getQuantity());

        // 주문 생성
        FixedSalesOrder order = FixedSalesOrder.createOrder(
                request,
                request.getFixedSale().getPrice(),
                request.getQuantity()
        );
        fixedSalesOrderRepository.save(order);
    }

    @Transactional
    public void rejectPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("구매 요청을 찾을 수 없습니다."));

        // 판매자 확인
        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("판매자만 요청을 거절할 수 있습니다.");
        }

        request.reject();
    }

    @Transactional
    public void cancelPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("구매 요청을 찾을 수 없습니다."));

        // 구매자 확인
        if (!request.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("본인의 요청만 취소할 수 있습니다.");
        }

        request.reject(); // CANCELED status could be better, but REJECTED/CANCELED are similar.
    }

    public PurchaseRequestResponse convertToResponse(PurchaseRequest request) {
        return PurchaseRequestResponse.builder()
                .id(request.getPurchaseRequestId())
                .productName(request.getFixedSale().getProduct().getProductName())
                .buyerName(request.getUser().getNickname())
                .sellerName(request.getFixedSale().getUser().getNickname())
                .quantity(request.getQuantity())
                .price(request.getFixedSale().getPrice())
                .priceUnit("원") // 일반 판매는 현재 "원" 단위를 기본으로 사용
                .status(request.getPurchaseRequestStatus())
                .requestDate(request.getCreatedAt())
                .build();
    }
}
