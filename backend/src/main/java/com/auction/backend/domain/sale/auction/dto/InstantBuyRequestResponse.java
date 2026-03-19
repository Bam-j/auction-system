package com.auction.backend.domain.sale.auction.dto;

import com.auction.backend.global.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class InstantBuyRequestResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String requesterNickname;
    private String sellerNickname;
    private String price;
    private String priceUnit;
    private RequestStatus status;
    private LocalDateTime requestDate;
}
