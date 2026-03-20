package com.auction.backend.global.exception;

public class InvalidSalesStatusException extends RuntimeException {
    public InvalidSalesStatusException(String message) {
        super(message);
    }
}
