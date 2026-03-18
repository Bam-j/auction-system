package com.auction.backend.domain.purchaserequest.service;

import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.purchaserequest.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.purchaserequest.dto.InstantBuyRequestResponse;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestResponse;
import com.auction.backend.domain.purchaserequest.entity.InstantBuyRequest;
import com.auction.backend.domain.purchaserequest.entity.PurchaseRequest;
import com.auction.backend.domain.purchaserequest.repository.InstantBuyRequestRepository;
import com.auction.backend.domain.purchaserequest.repository.PurchaseRequestRepository;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.domain.fixedsalesorder.entity.FixedSalesOrder;
import com.auction.backend.domain.fixedsalesorder.repository.FixedSalesOrderRepository;
import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.enums.RequestStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseRequestService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final InstantBuyRequestRepository instantBuyRequestRepository;
    private final FixedSaleRepository fixedSaleRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final FixedSalesOrderRepository fixedSalesOrderRepository;

    @Transactional
    public Long createPurchaseRequest(Long userId, PurchaseRequestCreateRequest request) {
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

    @Transactional
    public Long createInstantBuyRequest(Long userId, InstantBuyCreateRequest request) {
        log.info("Creating instant buy request for user: {}, auction: {}", 
                userId, request.getAuctionId());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Auction auction = auctionRepository.findById(request.getAuctionId())
                .orElseThrow(() -> new RuntimeException("경매 정보를 찾을 수 없습니다."));

        if (auction.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("자신의 경매 상품은 즉시 구매할 수 없습니다.");
        }

        if (auction.getInstantPurchasePrice() == null) {
            throw new RuntimeException("즉시 구매가 가능한 경매 상품이 아닙니다.");
        }

        InstantBuyRequest instantBuyRequest = InstantBuyRequest.createInstantBuyRequest(
                user,
                auction
        );

        instantBuyRequestRepository.save(instantBuyRequest);

        return instantBuyRequest.getInstantBuyRequestId();
    }

    public List<PurchaseRequestResponse> getUserPurchaseRequests(Long userId, String category, String status, String searchType, String keyword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        ProductCategory productCategory = null;
        if (category != null && !category.equals("ALL") && !category.isEmpty()) {
            productCategory = ProductCategory.valueOf(category);
        }

        RequestStatus requestStatus = null;
        if (status != null && !status.equals("ALL") && !status.isEmpty()) {
            requestStatus = RequestStatus.valueOf(status);
        }

        String searchKeyword = keyword;
        if (keyword != null && keyword.isEmpty()) {
            searchKeyword = null;
        }

        String stype = searchType;
        if (searchType != null && (searchType.isEmpty() || searchType.equals("ALL"))) {
            stype = null;
        }
        
        return purchaseRequestRepository.findByUserWithFilters(user, productCategory, requestStatus, stype, searchKeyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<InstantBuyRequestResponse> getUserInstantBuyRequests(Long userId, String category, String status, String keyword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        ProductCategory productCategory = null;
        if (category != null && !category.equals("ALL") && !category.isEmpty()) {
            productCategory = ProductCategory.valueOf(category);
        }

        RequestStatus requestStatus = null;
        if (status != null && !status.equals("ALL") && !status.isEmpty()) {
            requestStatus = RequestStatus.valueOf(status);
        }

        String searchKeyword = keyword;
        if (keyword != null && keyword.isEmpty()) {
            searchKeyword = null;
        }

        return instantBuyRequestRepository.findByUserOrSellerWithFilters(user, productCategory, requestStatus, searchKeyword).stream()
                .map(this::convertToInstantResponse)
                .collect(Collectors.toList());
    }

    public List<InstantBuyRequestResponse> getAllInstantBuyRequests(String category, String status, String searchType, String keyword) {
        ProductCategory productCategory = null;
        if (category != null && !category.equals("ALL") && !category.isEmpty()) {
            productCategory = ProductCategory.valueOf(category);
        }

        RequestStatus requestStatus = null;
        if (status != null && !status.equals("ALL") && !status.isEmpty()) {
            requestStatus = RequestStatus.valueOf(status);
        }

        String searchKeyword = keyword;
        if (keyword != null && keyword.isEmpty()) {
            searchKeyword = null;
        }

        String stype = searchType;
        if (searchType != null && (searchType.isEmpty() || searchType.equals("ALL"))) {
            stype = null;
        }

        return instantBuyRequestRepository.findByFilters(productCategory, requestStatus, stype, searchKeyword).stream()
                .map(this::convertToInstantResponse)
                .collect(Collectors.toList());
    }

    public List<PurchaseRequestResponse> getSellerPurchaseRequests(Long userId, String category, String status, String searchType, String keyword) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        ProductCategory productCategory = null;
        if (category != null && !category.equals("ALL") && !category.isEmpty()) {
            productCategory = ProductCategory.valueOf(category);
        }

        RequestStatus requestStatus = null;
        if (status != null && !status.equals("ALL") && !status.isEmpty()) {
            requestStatus = RequestStatus.valueOf(status);
        }

        String searchKeyword = keyword;
        if (keyword != null && keyword.isEmpty()) {
            searchKeyword = null;
        }

        String stype = searchType;
        if (searchType != null && (searchType.isEmpty() || searchType.equals("ALL"))) {
            stype = null;
        }

        return purchaseRequestRepository.findBySellerWithFilters(seller, productCategory, requestStatus, stype, searchKeyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approvePurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("구매 요청을 찾을 수 없습니다."));

        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("판매자만 요청을 수락할 수 있습니다.");
        }

        if (SalesStatus.SOLD_OUT.equals(request.getFixedSale().getProduct().getSalesStatus())) {
            throw new RuntimeException("이미 품절된 상품입니다.");
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

    @Transactional
    public void approveInstantBuyRequest(Long userId, Long requestId) {
        InstantBuyRequest request = instantBuyRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("즉시 구매 요청을 찾을 수 없습니다."));

        if (!request.getAuction().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("판매자만 요청을 수락할 수 있습니다.");
        }

        if (SalesStatus.SOLD_OUT.equals(request.getAuction().getProduct().getSalesStatus()) ||
            SalesStatus.INSTANT_BUY.equals(request.getAuction().getProduct().getSalesStatus())) {
            throw new RuntimeException("이미 낙찰 또는 판매 완료된 상품입니다.");
        }

        request.approve();
        request.getAuction().getProduct().instantBuy();
    }

    @Transactional
    public void rejectInstantBuyRequest(Long userId, Long requestId) {
        InstantBuyRequest request = instantBuyRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("즉시 구매 요청을 찾을 수 없습니다."));

        if (!request.getAuction().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("판매자만 요청을 거절할 수 있습니다.");
        }

        request.reject();
    }

    @Transactional
    public void rejectPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("구매 요청을 찾을 수 없습니다."));

        if (!request.getFixedSale().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("판매자만 요청을 거절할 수 있습니다.");
        }

        request.reject();
    }

    @Transactional
    public void cancelPurchaseRequest(Long userId, Long requestId) {
        PurchaseRequest request = purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("구매 요청을 찾을 수 없습니다."));

        if (!request.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("본인의 요청만 취소할 수 있습니다.");
        }

        request.reject();
    }

    public PurchaseRequestResponse convertToResponse(PurchaseRequest request) {
        return PurchaseRequestResponse.builder()
                .id(request.getPurchaseRequestId())
                .productId(request.getFixedSale().getProduct().getProductId())
                .productName(request.getFixedSale().getProduct().getProductName())
                .buyerName(request.getUser().getNickname())
                .sellerName(request.getFixedSale().getUser().getNickname())
                .quantity(request.getQuantity())
                .price(request.getFixedSale().getPrice())
                .priceUnit("에메랄드")
                .status(request.getRequestStatus())
                .requestDate(request.getCreatedAt())
                .build();
    }

    private InstantBuyRequestResponse convertToInstantResponse(InstantBuyRequest request) {
        return InstantBuyRequestResponse.builder()
                .id(request.getInstantBuyRequestId())
                .productId(request.getAuction().getProduct().getProductId())
                .productName(request.getAuction().getProduct().getProductName())
                .requesterNickname(request.getUser().getNickname())
                .sellerNickname(request.getAuction().getUser().getNickname())
                .price(request.getAuction().getInstantPurchasePrice() != null ? String.valueOf(request.getAuction().getInstantPurchasePrice()) : null)
                .priceUnit(getPriceUnitDisplayName(request.getAuction().getPriceUnit()))
                .status(request.getRequestStatus())
                .requestDate(request.getCreatedAt())
                .build();
    }

    private String getPriceUnitDisplayName(PriceUnit unit) {
        if (unit == null) return "에메랄드";
        return switch (unit) {
            case EMERALD -> "에메랄드";
            case EMERALD_BLOCK -> "에메랄드 블록";
            case EMERALD_COIN -> "에메랄드 주화";
        };
    }
}
