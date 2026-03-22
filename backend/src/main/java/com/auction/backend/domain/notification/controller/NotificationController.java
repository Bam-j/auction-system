package com.auction.backend.domain.notification.controller;

import com.auction.backend.domain.notification.dto.NotificationResponse;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.notification.service.NotificationQueryService;
import com.auction.backend.global.jwt.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@Tag(name = "Notification", description = "알림 API")
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationCommandService notificationCommandService;
    private final NotificationQueryService notificationQueryService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "알림 구독 (SSE)", description = "실시간 알림을 위한 SSE 연결 구독")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "SSE 연결 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자")
    })
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
            throw new BadCredentialsException("인증이 필요합니다.");
        }
        return notificationQueryService.subscribe(jwtTokenProvider.getUserIdFromAuthentication(auth));
    }

    @Operation(summary = "알림 목록 조회", description = "현재 사용자의 모든 알림 목록 조회")
    @ApiResponse(responseCode = "200", description = "알림 목록 조회 성공")
    @GetMapping
    public List<NotificationResponse> getNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return notificationQueryService.getNotifications(jwtTokenProvider.getUserIdFromAuthentication(auth));
    }

    @Operation(summary = "알림 읽음 처리", description = "특정 알림을 읽음 상태로 변경")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "읽음 처리 성공"),
            @ApiResponse(responseCode = "404", description = "해당 알림을 찾을 수 없음")
    })
    @PatchMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable Long notificationId) {
        notificationCommandService.markAsRead(notificationId);
    }

    @Operation(summary = "모든 알림 읽음 처리", description = "현재 사용자의 모든 알림을 읽음 상태로 변경")
    @ApiResponse(responseCode = "200", description = "전체 읽음 처리 성공")
    @PatchMapping("/read-all")
    public void markAllAsRead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        notificationCommandService.markAllAsRead(jwtTokenProvider.getUserIdFromAuthentication(auth));
    }
}
