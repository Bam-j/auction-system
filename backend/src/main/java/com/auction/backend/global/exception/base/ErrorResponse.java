package com.auction.backend.global.exception.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private final LocalDateTime timestamp = LocalDateTime.now();
    private final int status;
    private final String error;
    private final String code;
    private final String message;
    private final Map<String, String> errors;

    public static ResponseEntity<ErrorResponse> toResponseEntity(ErrorCode errorCode) {
        return toResponseEntity(errorCode, null);
    }

    public static ResponseEntity<ErrorResponse> toResponseEntity(ErrorCode errorCode, Map<String, String> errors) {
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ErrorResponse.builder()
                        .status(errorCode.getStatus())
                        .error(errorCode.name())
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .errors(errors)
                        .build()
                );
    }

    public static ResponseEntity<ErrorResponse> toResponseEntity(int status, String error, String message) {
        return toResponseEntity(status, error, message, null);
    }

    public static ResponseEntity<ErrorResponse> toResponseEntity(int status, String error, String message, Map<String, String> errors) {
        return ResponseEntity
                .status(status)
                .body(ErrorResponse.builder()
                        .status(status)
                        .error(error)
                        .message(message)
                        .errors(errors)
                        .build()
                );
    }
}
