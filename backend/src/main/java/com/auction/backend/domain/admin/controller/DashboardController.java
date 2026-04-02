package com.auction.backend.domain.admin.controller;

import com.auction.backend.domain.admin.dto.UserStatsResponse;
import com.auction.backend.domain.admin.service.DashboardQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin Dashboard", description = "관리자 대시보드 통계 API")
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardQueryService dashboardQueryService;

    @Operation(summary = "회원 통계 조회", description = "오늘의 회원 상태 요약 및 기간별 가입/상태 변경 추이 데이터를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "통계 데이터 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자")
    })
    @GetMapping("/user-stats")
    public ResponseEntity<UserStatsResponse> getUserStats(
            @Parameter(description = "조회 기간 (일수)", example = "7")
            @RequestParam(defaultValue = "1") int days) {
        return ResponseEntity.ok(dashboardQueryService.getUserStats(days));
    }
}
