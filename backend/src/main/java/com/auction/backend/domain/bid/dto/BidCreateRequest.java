package com.auction.backend.domain.bid.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BidCreateRequest {
    @NotNull(message = "경매 ID는 필수입니다.")
    private Long auctionId;

    @NotNull(message = "입찰 가격은 필수입니다.")
    private Integer bidPrice;
}
