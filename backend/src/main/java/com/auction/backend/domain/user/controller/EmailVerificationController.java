package com.auction.backend.domain.user.controller;

import com.auction.backend.domain.user.dto.email.EmailRequest;
import com.auction.backend.domain.user.dto.email.EmailVerificationCheckRequest;
import com.auction.backend.domain.user.service.EmailVerificationCommandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Email Verification", description = "이메일 인증 관련 API")
@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationCommandService emailVerificationCommandService;

    @Operation(summary = "인증 번호 발송", description = "입력한 이메일로 6자리 인증 번호를 발송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 번호 발송 성공"),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 이메일 형식"),
            @ApiResponse(responseCode = "409", description = "이미 사용 중인(인증된) 이메일")
    })
    @PostMapping("/verification")
    public ResponseEntity<Void> sendVerificationCode(@RequestBody @Valid EmailRequest request) {
        emailVerificationCommandService.sendVerificationEmail(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "인증 번호 확인", description = "이메일로 받은 인증 번호를 확인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 번호 확인 완료"),
            @ApiResponse(responseCode = "400", description = "필수 값 누락 또는 잘못된 형식")
    })
    @PostMapping("/verification/check")
    public ResponseEntity<Boolean> verifyCode(@RequestBody @Valid EmailVerificationCheckRequest request) {
        boolean isVerified = emailVerificationCommandService.verifyCode(request.getEmail(), request.getCode());
        return ResponseEntity.ok(isVerified);
    }
}
