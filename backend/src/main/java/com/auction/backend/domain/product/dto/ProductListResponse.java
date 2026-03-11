package com.auction.backend.domain.product.dto;

import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.global.enums.ProductCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProductListResponse {
    private Long id;
    private Long auctionId;
    private Long fixedSaleId;
    private String title;
    private String seller;
    private String price;
    private String priceUnit;
    private String imageUrl;
    private SalesStatus status;
    private String type;
    private ProductCategory category;
    private String description;
    private Integer stock;
    private LocalDateTime createdAt;

    //경매용 데이터
    private LocalDateTime endedAt;
    private Integer startPrice;
    private Integer currentPrice;
    private Integer bidIncrement;
    private String instantPrice;
}
