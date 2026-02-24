package com.auction.backend.domain.user.controller;

import com.auction.backend.domain.user.dto.profile.DeleteAccountRequest;
import com.auction.backend.domain.user.dto.profile.UpdateNicknameRequest;
import com.auction.backend.domain.user.dto.profile.UpdatePasswordRequest;
import com.auction.backend.domain.user.service.UserCommandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserCommandService userCommandService;

    @PatchMapping("/me/nickname")
    public ResponseEntity<Void> updateNickname(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateNicknameRequest request) {

        Long userId = Long.valueOf(userDetails.getUsername());
        userCommandService.updateNickname(userId, request.getNewNickname());

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdatePasswordRequest request) {

        Long userId = Long.valueOf(userDetails.getUsername());
        userCommandService.updatePassword(userId, request.getNewPassword());

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DeleteAccountRequest request) {

        Long userId = Long.valueOf(userDetails.getUsername());
        userCommandService.deleteAccount(userId, request.getPassword());

        return ResponseEntity.noContent().build();
    }
}
