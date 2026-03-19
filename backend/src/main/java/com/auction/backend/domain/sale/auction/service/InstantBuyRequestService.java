package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.sale.auction.dto.InstantBuyRequestResponse;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.entity.InstantBuyRequest;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.sale.auction.repository.InstantBuyRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.enums.RequestStatus;
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
public class InstantBuyRequestService {

    private final InstantBuyRequestRepository instantBuyRequestRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

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

        String searchKeyword = (keyword != null && !keyword.isEmpty()) ? keyword : null;

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

        String searchKeyword = (keyword != null && !keyword.isEmpty()) ? keyword : null;
        String stype = (searchType != null && !searchType.isEmpty() && !searchType.equals("ALL")) ? searchType : null;

        return instantBuyRequestRepository.findByFilters(productCategory, requestStatus, stype, searchKeyword).stream()
                .map(this::convertToInstantResponse)
                .collect(Collectors.toList());
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
