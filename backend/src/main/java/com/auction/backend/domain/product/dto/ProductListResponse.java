package com.auction.backend.domain.product.dto;

import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.global.enums.ProductCategory;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductListResponse {
    private Long id;
    private String title;
    private String seller;
    private String price;
    private String priceUnit;
    private String imageUrl;
    private SalesStatus status;
    private String type; // "FIXED" or "AUCTION"
    private ProductCategory category;
}
