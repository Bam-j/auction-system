package com.auction.backend.global.exception;

public class UserUnverifiedException extends RuntimeException {
    public UserUnverifiedException(String message) {
        super(message);
    }
}
