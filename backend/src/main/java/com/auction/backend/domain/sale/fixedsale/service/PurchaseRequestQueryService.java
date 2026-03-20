package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.enums.RequestStatus;
import com.auction.backend.global.exception.ResourceNotFoundException;
import com.auction.backend.global.utils.SearchParamParser;
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
public class PurchaseRequestQueryService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final UserRepository userRepository;

    //특정 회원의 구매 요청 조회
    public List<PurchaseRequestResponse> getUserPurchaseRequests(Long userId, String category, String status, String searchType, String keyword) {
        User user = getUser(userId);

        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return purchaseRequestRepository.findByUserWithFilters(user, productCategory, requestStatus, stype, searchKeyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    //일반 상품 판매자가 자신에게 들어온 구매 요청 조회
    public List<PurchaseRequestResponse> getSellerPurchaseRequests(Long userId, String category, String status, String searchType, String keyword) {
        User seller = getUser(userId);

        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return purchaseRequestRepository.findBySellerWithFilters(seller, productCategory, requestStatus, stype, searchKeyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
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

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
    }
}
