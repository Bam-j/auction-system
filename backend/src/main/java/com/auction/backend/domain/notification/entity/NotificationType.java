package com.auction.backend.domain.notification.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
    PURCHASE_REQUEST_RECEIVED("새로운 구매 요청이 들어왔습니다."),
    INSTANT_BUY_REQUEST_RECEIVED("새로운 즉시 구매 요청이 들어왔습니다."),

    AUCTION_EXPIRED("경매 상품의 기한이 마감되었습니다."),
    OUTBID("다른 사람이 더 높은 금액으로 입찰하여 패찰되었습니다."),
    BID_WON("경매에 낙찰되었습니다!"),

    PURCHASE_REQUEST_APPROVED("구매 요청이 승인되었습니다."),
    PURCHASE_REQUEST_REJECTED("구매 요청이 거절되었습니다."),

    INSTANT_BUY_REQUEST_APPROVED("즉시 구매 요청이 승인되었습니다."),
    INSTANT_BUY_REQUEST_REJECTED("즉시 구매 요청이 거절되었습니다.");

    private final String defaultMessage;
}
