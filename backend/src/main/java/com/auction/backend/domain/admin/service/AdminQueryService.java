package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.dto.BidSearchCondition;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.bid.service.BidQueryService;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.product.service.ProductQueryService;
import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.sale.fixedsale.service.PurchaseRequestQueryService;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.enums.RequestStatus;
import com.auction.backend.global.utils.SearchParamParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminQueryService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;
    private final BidRepository bidRepository;
    private final ProductQueryService productQueryService;
    private final PurchaseRequestQueryService purchaseRequestQueryService;
    private final BidQueryService bidQueryService;

    //시스템에 등록된 모든 회원 조회
    public List<UserResponse> getAllUsers(String keyword, String status) {
        UserStatus userStatus = SearchParamParser.parseEnum(UserStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);

        return userRepository.findByKeywordAndStatus(searchKeyword, userStatus).stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    //시스템에 등록된 모든 상품 조회
    public List<ProductListResponse> getAllProducts(String category, String status, String searchType, String keyword) {
        return productQueryService.getAllProducts(category, status, searchType, keyword);
    }

    //시스템에 등록된 모든 구매 요청(일반 판매) 조회
    public List<PurchaseRequestResponse> getAllPurchaseRequests(String category, String status, String searchType, String keyword) {
        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        RequestStatus requestStatus = SearchParamParser.parseEnum(RequestStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return purchaseRequestRepository.findByFilters(productCategory, requestStatus, stype, searchKeyword).stream()
                .map(purchaseRequestQueryService::convertToResponse)
                .collect(Collectors.toList());
    }

    //시스템에 등록된 모든 입찰 조회
    public List<BidResponse> getAllBids(String category, String status, String searchType, String keyword) {
        BidSearchCondition condition = BidSearchCondition.of(category, status, keyword, searchType);

        return bidRepository.findByFilters(
                        condition.getCategory(),
                        condition.getStatus(),
                        condition.getSearchType(),
                        condition.getKeyword()
                ).stream()
                .map(bidQueryService::convertToResponse)
                .collect(Collectors.toList());
    }
}
