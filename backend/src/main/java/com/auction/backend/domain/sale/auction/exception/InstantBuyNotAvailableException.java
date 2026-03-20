package com.auction.backend.domain.sale.auction.exception;

public class InstantBuyNotAvailableException extends RuntimeException {
    public InstantBuyNotAvailableException(String message) {
        super(message);
    }
}
