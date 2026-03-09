package com.auction.backend.domain.purchaserequest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InstantBuyCreateRequest {
    @NotNull(message = "경매 ID는 필수입니다.")
    private Long auctionId;
}
