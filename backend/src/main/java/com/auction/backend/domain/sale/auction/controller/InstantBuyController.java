package com.auction.backend.domain.sale.auction.controller;

import com.auction.backend.domain.sale.auction.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.sale.auction.dto.InstantBuyRequestResponse;
import com.auction.backend.domain.sale.auction.service.InstantBuyRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "InstantBuyRequest", description = "경매 상품의 즉시 구매 요청 API")
@Slf4j
@RestController
@RequestMapping("/api/v1/instant-buy-requests")
@RequiredArgsConstructor
public class InstantBuyController {

    private final InstantBuyRequestService instantBuyRequestService;

    @Operation(summary = "즉시 구매 요청 생성", description = "경매 상품에 대한 즉시 구매 요청 생성")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 생성 성공")
    @PostMapping
    public ResponseEntity<Map<String, Long>> createInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "즉시 구매 요청 정보. 대상 상품 ID 정보를 가진 DTO")
            @Valid @RequestBody InstantBuyCreateRequest request) {
        
        Long userId = Long.parseLong(principal.getUsername());
        Long instantBuyRequestId = instantBuyRequestService.createInstantBuyRequest(userId, request);

        return ResponseEntity.ok(Map.of("instantBuyRequestId", instantBuyRequestId));
    }

    @Operation(summary = "즉시 구매 요청 조회", description = "사용자 자신의 즉시 구매 요청 조회")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 조회 성공")
    @GetMapping("/me")
    public ResponseEntity<List<InstantBuyRequestResponse>> getMyInstantBuyRequests(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "즉시 구매 요청 상태", example = "PENDING")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(instantBuyRequestService.getUserInstantBuyRequests(userId, category, status, keyword));
    }

    @Operation(summary = "전체 즉시 구매 요청 조회", description = "전체 즉시 구매 요청 목록 조회 (관리자용)")
    @ApiResponse(responseCode = "200", description = "전체 즉시 구매 요청 목록 조회 성공")
    @GetMapping("/admin")
    public ResponseEntity<List<InstantBuyRequestResponse>> getAllInstantBuyRequests(
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "즉시 구매 요청 상태", example = "PENDING")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(instantBuyRequestService.getAllInstantBuyRequests(category, status, searchType, keyword));
    }

    @Operation(summary = "즉시 구매 요청 승인", description = "특정 즉시 구매 요청을 승인. 승인 후 해당 상품은 경매 종료(판매 종료)")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 승인 성공")
    @PostMapping("/{requestId}/approve")
    public ResponseEntity<Void> approveInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "승인 대상 즉시 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        instantBuyRequestService.approveInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "즉시 구매 요청 거부", description = "특정 즉시 구매 요청을 거부. 경매는 계속 진행.")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 거부 성공")
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<Void> rejectInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "거부 대상 즉시 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        instantBuyRequestService.rejectInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }
}
