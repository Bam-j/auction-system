package com.auction.backend.domain.product.repository;

import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;

import java.util.List;

public interface ProductRepositoryCustom {
    List<ProductListResponse> findByFiltersWithQueryDSL(
            ProductCategory category,
            SalesStatus status,
            String searchType,
            String keyword);

    List<ProductListResponse> findByUserWithFiltersWithQueryDSL(
            User user,
            ProductCategory category,
            SalesStatus status,
            String keyword);

    ProductListResponse findProductDetailWithQueryDSL(Long productId);
}
