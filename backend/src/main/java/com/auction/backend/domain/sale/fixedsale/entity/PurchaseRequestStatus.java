package com.auction.backend.domain.sale.fixedsale.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PurchaseRequestStatus {
    PENDING, APPROVED, REJECTED
}
