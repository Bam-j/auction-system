package com.auction.backend.domain.product.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SalesStatus {
    FIXED_SALES, AUCTION, SOLD_OUT, INSTANT_BUY
}
