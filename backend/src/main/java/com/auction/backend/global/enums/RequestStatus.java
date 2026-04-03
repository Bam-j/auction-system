package com.auction.backend.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RequestStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED
}
