package com.auction.backend.global.exception;

public class SelfPurchaseException extends RuntimeException {
    public SelfPurchaseException(String message) {
        super(message);
    }
}
