package com.auction.backend.domain.bid.dto;

import com.auction.backend.domain.bid.entity.BidStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BidResponse {
    private Long id;
    private String productName;
    private String bidderName;
    private String sellerName;
    private Integer bidPrice;
    private String priceUnit;
    private BidStatus status;
    private LocalDateTime bidDate;
}
