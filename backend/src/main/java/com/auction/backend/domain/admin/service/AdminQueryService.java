package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.service.BidQueryService;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.service.ProductQueryService;
import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.sale.fixedsale.service.PurchaseRequestQueryService;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminQueryService {

    private final UserQueryService userQueryService;
    private final ProductQueryService productQueryService;
    private final PurchaseRequestQueryService purchaseRequestQueryService;
    private final BidQueryService bidQueryService;

    //시스템에 등록된 모든 회원 조회
    public List<UserResponse> getAllUsers(String keyword, String status) {
        return userQueryService.getAllUsers(keyword, status);
    }

    //시스템에 등록된 모든 상품 조회
    public List<ProductListResponse> getAllProducts(String category, String status, String searchType, String keyword) {
        return productQueryService.getAllProducts(category, status, searchType, keyword);
    }

    //시스템에 등록된 모든 구매 요청(일반 판매) 조회
    public List<PurchaseRequestResponse> getAllPurchaseRequests(String category, String status, String searchType, String keyword) {
        return purchaseRequestQueryService.getAllPurchaseRequests(category, status, searchType, keyword);
    }

    //시스템에 등록된 모든 입찰 조회
    public List<BidResponse> getAllBids(String category, String status, String searchType, String keyword) {
        return bidQueryService.getAllBids(category, status, searchType, keyword);
    }
}
