package com.auction.backend.global.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PriceUnit {
    EMERALD("에메랄드"),
    EMERALD_BLOCK("에메랄드 블록"),
    EMERALD_COIN("에메랄드 주화");

    private final String displayName;

    //각 단위의 한글 명칭 반환
    public static String getDisplayName(PriceUnit unit) {
        if (unit == null) return "에메랄드";
        return unit.getDisplayName();
    }
}
