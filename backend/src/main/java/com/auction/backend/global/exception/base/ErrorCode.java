package com.auction.backend.global.exception.base;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // 공통 (C)
    INVALID_INPUT_VALUE(400, "C001", "입력값이 올바르지 않습니다."),
    BAD_REQUEST(400, "C002", "잘못된 요청입니다."),
    RESOURCE_NOT_FOUND(404, "C003", "리소스를 찾을 수 없습니다."),
    CONFLICT(409, "C004", "리소스 상태가 충돌되었습니다."),
    INTERNAL_SERVER_ERROR(500, "C005", "서버 내부 오류가 발생했습니다."),

    // 인증 및 권한 (A)
    UNAUTHORIZED(401, "A001", "인증에 실패하였습니다."),
    FORBIDDEN(403, "A002", "권한이 없습니다."),

    // 유저 (U)
    DUPLICATE_USER(409, "U001", "이미 존재하는 사용자입니다."),
    SAME_PASSWORD(409, "U002", "기존 비밀번호와 동일합니다."),

    // 판매 및 상품 (S)
    INSUFFICIENT_STOCK(409, "S001", "재고가 부족합니다."),
    INVALID_SALES_STATUS(409, "S002", "잘못된 판매 상태입니다."),
    SELF_PURCHASE(409, "S003", "본인 상품은 구매할 수 없습니다."),
    INSTANT_BUY_NOT_AVAILABLE(400, "S004", "즉시 구매가 불가능한 상품입니다."),

    // 입찰 (B)
    INVALID_BID(409, "B001", "잘못된 입찰 요청입니다."),

    // 파일 (F)
    FILE_UPLOAD_ERROR(500, "F001", "파일 업로드 오류가 발생했습니다.");

    private final int status;
    private final String code;
    private final String message;
}
