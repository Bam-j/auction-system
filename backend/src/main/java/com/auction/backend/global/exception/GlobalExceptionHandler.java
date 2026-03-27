package com.auction.backend.global.exception;

import com.auction.backend.domain.bid.exception.InvalidBidException;
import com.auction.backend.domain.sale.auction.exception.InstantBuyNotAvailableException;
import com.auction.backend.domain.sale.fixedsale.exception.InsufficientStockException;
import com.auction.backend.domain.user.exception.DuplicateUserException;
import com.auction.backend.domain.user.exception.SamePasswordException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<ErrorResponse> handleValidationExceptions(Exception ex) {
        Map<String, String> errors = new HashMap<>();
        BindingResult bindingResult;

        if (ex instanceof MethodArgumentNotValidException) {
            bindingResult = ((MethodArgumentNotValidException) ex).getBindingResult();
        } else {
            bindingResult = ((BindException) ex).getBindingResult();
        }

        bindingResult.getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error(HttpStatus.BAD_REQUEST.name())
                        .message("입력값이 올바르지 않습니다.")
                        .validationErrors(errors)
                        .build());
    }

    // 400 BAD_REQUEST: 비즈니스 로직 위반 및 잘못된 인자
    @ExceptionHandler({
            IllegalArgumentException.class,
            IllegalStateException.class,
            InstantBuyNotAvailableException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequestExceptions(Exception ex) {
        return ErrorResponse.toResponseEntity(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.name(),
                ex.getMessage()
        );
    }

    // 401 UNAUTHORIZED: 인증 실패
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedExceptions(Exception ex) {
        return ErrorResponse.toResponseEntity(
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED.name(),
                ex.getMessage()
        );
    }

    // 403 FORBIDDEN: 권한 부족 및 계정 상태(탈퇴, 차단)
    @ExceptionHandler({
            DisabledException.class,
            LockedException.class,
            UnauthorizedAccessException.class,
            UserUnverifiedException.class
    })
    public ResponseEntity<ErrorResponse> handleForbiddenExceptions(Exception ex) {
        return ErrorResponse.toResponseEntity(
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN.name(),
                ex.getMessage()
        );
    }

    // 404 NOT_FOUND: 리소스를 찾을 수 없음
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ErrorResponse.toResponseEntity(
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.name(),
                ex.getMessage()
        );
    }

    // 409 CONFLICT: 리소스 상태 충돌 (중복 회원, 재고 부족, 본인 상품 구매/입찰, 잘못된 판매 상태 등)
    @ExceptionHandler({
            DuplicateUserException.class,
            SamePasswordException.class,
            InsufficientStockException.class,
            SelfPurchaseException.class,
            InvalidSalesStatusException.class,
            InvalidBidException.class
    })
    public ResponseEntity<ErrorResponse> handleConflictExceptions(Exception ex) {
        return ErrorResponse.toResponseEntity(
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.name(),
                ex.getMessage()
        );
    }

    // 500 INTERNAL_SERVER_ERROR: 파일 업로드 오류
    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ErrorResponse> handleFileUploadException(FileUploadException ex) {
        log.error("File upload error: ", ex);
        return ErrorResponse.toResponseEntity(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.name(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        log.error("Unhandled Exception occurred: ", ex);

        return ErrorResponse.toResponseEntity(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.name(),
                "서버 내부 오류가 발생했습니다. 관리자에게 문의하세요."
        );
    }
}
