package com.auction.backend.domain.user.controller;

import com.auction.backend.domain.user.dto.auth.LoginRequest;
import com.auction.backend.domain.user.dto.auth.LoginResponse;
import com.auction.backend.domain.user.dto.auth.SignUpRequest;
import com.auction.backend.domain.user.exception.DuplicateUserException;
import com.auction.backend.domain.user.service.AuthCommandService;
import com.auction.backend.domain.user.service.AuthQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Auth", description = "회원 인증 인가 API")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthCommandService authCommandService;
    private final AuthQueryService authQueryService;

    @Operation(summary = "회원 가입", description = "회원 가입. 중복 검사 수행.")
    @ApiResponse(responseCode = "201", description = "회원 가입 성공")
    @PostMapping("/sign-up")
    public ResponseEntity<Void> signUp(
            @Parameter(description = "회원 가입 정보. username, nickname, password 정보를 포함한 DTO")
            @Valid @RequestBody SignUpRequest signUpRequest
    ) {
        authCommandService.save(signUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "username 중복 검사", description = "username 중복 검사 후 결과 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "중복되는 username 없음"),
            @ApiResponse(responseCode = "409", description = "이미 해당 username이 존재")
    })
    @GetMapping("/check/username")
    public ResponseEntity<?> checkUsername(
            @Parameter(description = "중복 검사할 username")
            @RequestParam("username") String username
    ) {
        try {
            authQueryService.checkUsername(username);
            return ResponseEntity.ok().build();
        } catch (DuplicateUserException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @Operation(summary = "nickname 중복 검사", description = "nickname 중복 검사 후 결과 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "중복되는 nickname 없음"),
            @ApiResponse(responseCode = "409", description = "이미 해당 nickname이 존재")
    })
    @GetMapping("/check/nickname")
    public ResponseEntity<?> checkNickname(
            @Parameter(description = "중복 검사할 nickname")
            @RequestParam("nickname") String nickname
    ) {
        try {
            authQueryService.checkNickname(nickname);
            return ResponseEntity.ok().build();
        } catch (DuplicateUserException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @Operation(summary = "로그인", description = "계정 로그인")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "401", description = "username 또는 password 입력 오류"),
            @ApiResponse(responseCode = "403", description = "탈퇴/차단된 계정으로 로그인 시도"),
            @ApiResponse(responseCode = "404", description = "로그인 하려는 username이 존재하지 않음")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Parameter(description = "로그인 정보. username, password 정보를 포함한 DTO")
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        LoginResponse response = authQueryService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
