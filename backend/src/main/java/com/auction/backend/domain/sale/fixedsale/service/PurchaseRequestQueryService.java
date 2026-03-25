package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
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
    private final UserQueryService userQueryService;

    //시스템에 등록된 모든 구매 요청(일반 판매) 조회
    public List<PurchaseRequestResponse> getAllPurchaseRequests(String category, String status, String searchType, String keyword) {
        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return purchaseRequestRepository
                .findByFiltersWithQueryDSL(productCategory, requestStatus, stype, searchKeyword)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    //특정 회원의 구매 요청 조회
    public List<PurchaseRequestResponse> getUserPurchaseRequests(Long userId, String category, String status, String searchType, String keyword) {
        User user = userQueryService.getUser(userId);

        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return purchaseRequestRepository
                .findByUserWithFiltersWithQueryDSL(user, productCategory, requestStatus, stype, searchKeyword)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    //일반 상품 판매자가 자신에게 들어온 구매 요청 조회
    public List<PurchaseRequestResponse> getSellerPurchaseRequests(Long userId, String category, String status, String searchType, String keyword) {
        User seller = userQueryService.getUser(userId);

        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return purchaseRequestRepository
                .findBySellerWithFiltersWithQueryDSL(seller, productCategory, requestStatus, stype, searchKeyword)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    //일반 판매 구매 요청 획득
    public PurchaseRequest getRequest(Long requestId) {
        return purchaseRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("구매 요청을 찾을 수 없습니다."));
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
}
