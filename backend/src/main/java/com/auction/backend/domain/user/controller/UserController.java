package com.auction.backend.domain.user.controller;

import com.auction.backend.domain.user.dto.profile.DeleteAccountRequest;
import com.auction.backend.domain.user.dto.profile.UpdateNicknameRequest;
import com.auction.backend.domain.user.dto.profile.UpdatePasswordRequest;
import com.auction.backend.domain.user.service.UserCommandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User", description = "회원 정보 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserCommandService userCommandService;

    @Operation(summary = "닉네임 변경 요청", description = "닉네임 변경 요청. 변경 과정에서 중복 검사 수행")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "닉네임 변경 성공"),
            @ApiResponse(responseCode = "404", description = "변경 대상 유저를 찾을 수 없음"),
            @ApiResponse(responseCode = "409", description = "변경하려는 닉네임이 이미 존재함")
    })
    @PatchMapping("/me/nickname")
    public ResponseEntity<Void> updateNickname(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "닉네임 변경 정보. 변경할 닉네임을 담은 DTO")
            @Valid @RequestBody UpdateNicknameRequest request) {

        Long userId = Long.valueOf(userDetails.getUsername());
        userCommandService.updateNickname(userId, request.getNewNickname());

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "패스워드 변경 요청", description = "패스워드 변경 요청. 변경 과정에서 중복 검사 수행 및 저장 전 암호화")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "패스워드 변경 성공"),
            @ApiResponse(responseCode = "404", description = "변경 대상 사용자를 찾을 수 없음"),
            @ApiResponse(responseCode = "409", description = "현재 사용 중인 패스워드로는 변경 요청을 할 수 없음")
    })
    @PatchMapping("/me/password")
    public ResponseEntity<Void> updatePassword(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "패스워드 변경 정보. 변경할 패스워드를 담은 DTO")
            @Valid @RequestBody UpdatePasswordRequest request) {

        Long userId = Long.valueOf(userDetails.getUsername());
        userCommandService.updatePassword(userId, request.getNewPassword());

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴 요청. Soft Delete 방식으로 탈퇴(삭제) 수행")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "회원 탈퇴 요청 성공"),
            @ApiResponse(responseCode = "400", description = "이미 탈퇴한 사용자"),
            @ApiResponse(responseCode = "401", description = "탈퇴 확인을 위한 비밀번호 입력 오류"),
            @ApiResponse(responseCode = "404", description = "탈퇴하려는 사용자를 찾을 수 없음")
    })
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "회원 탈퇴 정보. 탈퇴를 위한 비밀번호 정보 DTO")
            @Valid @RequestBody DeleteAccountRequest request) {

        Long userId = Long.valueOf(userDetails.getUsername());
        userCommandService.deleteAccount(userId, request.getPassword());

        return ResponseEntity.noContent().build();
    }
}
