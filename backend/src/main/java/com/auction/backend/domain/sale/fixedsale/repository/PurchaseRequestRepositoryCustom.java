package com.auction.backend.domain.sale.fixedsale.repository;

import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.enums.RequestStatus;

import java.util.List;

public interface PurchaseRequestRepositoryCustom {
    List<PurchaseRequest> findByFiltersWithQueryDSL(
            ProductCategory category,
            RequestStatus status,
            String searchType,
            String keyword);

    List<PurchaseRequest> findByUserWithFiltersWithQueryDSL(
            User user,
            ProductCategory category,
            RequestStatus status,
            String searchType,
            String keyword);

    List<PurchaseRequest> findBySellerWithFiltersWithQueryDSL(
            User seller,
            ProductCategory category,
            RequestStatus status,
            String searchType,
            String keyword);
}
