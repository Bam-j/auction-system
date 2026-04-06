package com.auction.backend.global.exception.auth;

public class UserUnverifiedException extends RuntimeException {
    public UserUnverifiedException(String message) {
        super(message);
    }
}
