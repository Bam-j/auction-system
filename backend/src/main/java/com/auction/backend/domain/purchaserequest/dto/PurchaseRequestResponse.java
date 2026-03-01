package com.auction.backend.domain.purchaserequest.dto;

import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PurchaseRequestResponse {
    private Long id;
    private String productName;
    private String buyerName;
    private String sellerName;
    private Integer quantity;
    private String price;
    private String priceUnit;
    private PurchaseRequestStatus status;
    private LocalDateTime requestDate;
}
