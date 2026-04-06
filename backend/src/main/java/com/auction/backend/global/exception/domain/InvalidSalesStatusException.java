package com.auction.backend.global.exception.domain;

public class InvalidSalesStatusException extends RuntimeException {
    public InvalidSalesStatusException(String message) {
        super(message);
    }
}
