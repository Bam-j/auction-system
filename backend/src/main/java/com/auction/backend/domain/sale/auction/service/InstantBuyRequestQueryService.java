package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.sale.auction.dto.InstantBuyRequestResponse;
import com.auction.backend.domain.sale.auction.entity.InstantBuyRequest;
import com.auction.backend.domain.sale.auction.repository.InstantBuyRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.enums.PriceUnit;
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
public class InstantBuyRequestQueryService {

    private final InstantBuyRequestRepository instantBuyRequestRepository;
    private final UserRepository userRepository;

    //특정 유저의 즉시 구매 요청 조회
    public List<InstantBuyRequestResponse> getUserInstantBuyRequests(Long userId, String category, String status, String keyword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);

        return instantBuyRequestRepository.findByUserOrSellerWithFilters(user, productCategory, requestStatus, searchKeyword).stream()
                .map(this::convertToInstantResponse)
                .collect(Collectors.toList());
    }

    //모든 즉시 구매 요청 조회
    public List<InstantBuyRequestResponse> getAllInstantBuyRequests(String category, String status, String searchType, String keyword) {
        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return instantBuyRequestRepository.findByFilters(productCategory, requestStatus, stype, searchKeyword).stream()
                .map(this::convertToInstantResponse)
                .collect(Collectors.toList());
    }

    private InstantBuyRequestResponse convertToInstantResponse(InstantBuyRequest request) {
        return InstantBuyRequestResponse.builder()
                .id(request.getInstantBuyRequestId())
                .productId(request.getAuction().getProduct().getProductId())
                .productName(request.getAuction().getProduct().getProductName())
                .requesterNickname(request.getUser().getNickname())
                .sellerNickname(request.getAuction().getUser().getNickname())
                .price(request.getAuction().getInstantPurchasePrice() != null ? String.valueOf(request.getAuction().getInstantPurchasePrice()) : null)
                .priceUnit(PriceUnit.getDisplayName(request.getAuction().getPriceUnit()))
                .status(request.getRequestStatus())
                .requestDate(request.getCreatedAt())
                .build();
    }
}
