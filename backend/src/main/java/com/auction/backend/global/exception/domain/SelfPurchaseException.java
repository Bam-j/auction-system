package com.auction.backend.global.exception.domain;

public class SelfPurchaseException extends RuntimeException {
    public SelfPurchaseException(String message) {
        super(message);
    }
}
