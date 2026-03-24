package com.auction.backend.domain.sale.auction.controller;

import com.auction.backend.domain.sale.auction.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.sale.auction.dto.InstantBuyRequestResponse;
import com.auction.backend.domain.sale.auction.service.InstantBuyRequestCommandService;
import com.auction.backend.domain.sale.auction.service.InstantBuyRequestQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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

    private final InstantBuyRequestCommandService instantBuyRequestCommandService;
    private final InstantBuyRequestQueryService instantBuyRequestQueryService;

    @Operation(summary = "즉시 구매 요청 생성", description = "경매 상품에 대한 즉시 구매 요청 생성")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "즉시 구매 요청 생성 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "400", description = "경매 상품이 즉시 구매가 가능하지 않음"),
            @ApiResponse(responseCode = "404", description = "요청자 또는 경매 정보를 찾을 수 없음"),
            @ApiResponse(responseCode = "409", description = "자신이 등록한 경매 상품은 즉시 구매할 수 없음")
    })
    @PostMapping
    public ResponseEntity<Map<String, Long>> createInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "즉시 구매 요청 정보. 대상 상품 ID 정보를 가진 DTO")
            @Valid @RequestBody InstantBuyCreateRequest request) {

        Long userId = Long.parseLong(principal.getUsername());
        Long instantBuyRequestId = instantBuyRequestCommandService.createInstantBuyRequest(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("instantBuyRequestId", instantBuyRequestId));
    }

    @Operation(summary = "즉시 구매 요청 조회", description = "사용자 자신의 즉시 구매 요청 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "즉시 구매 요청 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "대상 사용자를 찾을 수 없음")
    })
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
        return ResponseEntity.ok(instantBuyRequestQueryService.getUserInstantBuyRequests(userId, category, status, keyword));
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
        return ResponseEntity.ok(instantBuyRequestQueryService.getAllInstantBuyRequests(category, status, searchType, keyword));
    }

    @Operation(summary = "즉시 구매 요청 승인", description = "특정 즉시 구매 요청을 승인. 승인 후 해당 상품은 경매 종료(판매 종료)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "즉시 구매 요청 승인 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "403", description = "요청자가 판매자가 아니므로 요청을 승인할 수 없음"),
            @ApiResponse(responseCode = "404", description = "해당 즉시 구매 요청을 찾을 수 없음"),
            @ApiResponse(responseCode = "409", description = "이미 즉시 판매/낙찰된 상품에 대해 요청을 보냄")
    })
    @PostMapping("/{requestId}/approve")
    public ResponseEntity<Void> approveInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "승인 대상 즉시 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        instantBuyRequestCommandService.approveInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "즉시 구매 요청 거부", description = "특정 즉시 구매 요청을 거부. 경매는 계속 진행.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "즉시 구매 요청 거부 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "403", description = "요청자가 판매자가 아니므로 요청을 거부할 수 없음"),
            @ApiResponse(responseCode = "404", description = "해당 즉시 구매 요청을 찾을 수 없음"),
    })
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<Void> rejectInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "거부 대상 즉시 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        instantBuyRequestCommandService.rejectInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }
}
