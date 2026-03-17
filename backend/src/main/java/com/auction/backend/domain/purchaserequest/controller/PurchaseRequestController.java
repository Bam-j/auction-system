package com.auction.backend.domain.purchaserequest.controller;

import com.auction.backend.domain.purchaserequest.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.purchaserequest.dto.InstantBuyRequestResponse;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestResponse;
import com.auction.backend.domain.purchaserequest.service.PurchaseRequestService;
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

@Tag(name = "PurchaseRequest", description = "일반 상품의 구매 요청 API")
@Slf4j
@RestController
@RequestMapping("/api/v1/purchase-requests")
@RequiredArgsConstructor
public class PurchaseRequestController {

    private final PurchaseRequestService purchaseRequestService;

    @Operation(summary = "구매 요청 생성", description = "일반 판매 상품에 대한 구매 요청 생성")
    @ApiResponse(responseCode = "200", description = "구매 요청 생성 성공")
    @PostMapping
    public ResponseEntity<Map<String, Long>> createPurchaseRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "구매 요청 정보. 대상 상품 ID, 수량 정보를 가진 DTO")
            @Valid @RequestBody PurchaseRequestCreateRequest request) {
        
        Long userId = Long.parseLong(principal.getUsername());
        Long purchaseRequestId = purchaseRequestService.createPurchaseRequest(userId, request);

        return ResponseEntity.ok(Map.of("purchaseRequestId", purchaseRequestId));
    }

    @Operation(summary = "즉시 구매 요청 생성", description = "경매 상품에 대한 즉시 구매 요청 생성")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 생성 성공")
    @PostMapping("/instant")
    public ResponseEntity<Map<String, Long>> createInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "즉시 구매 요청 정보. 대상 상품 ID 정보를 가진 DTO")
            @Valid @RequestBody InstantBuyCreateRequest request) {
        
        Long userId = Long.parseLong(principal.getUsername());
        Long instantBuyRequestId = purchaseRequestService.createInstantBuyRequest(userId, request);

        return ResponseEntity.ok(Map.of("instantBuyRequestId", instantBuyRequestId));
    }

    @Operation(summary = "즉시 구매 요청 조회", description = "사용자 자신의 즉시 구매 요청 조회")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 조회 성공")
    @GetMapping("/instant/me")
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
        return ResponseEntity.ok(purchaseRequestService.getUserInstantBuyRequests(userId, category, status, keyword));
    }

    //admin api로 이동
    @Operation(summary = "전체 즉시 구매 요청 조회", description = "전체 즉시 구매 요청 목록 조회")
    @ApiResponse(responseCode = "200", description = "전체 즉시 구매 요청 목록 조회 성공")
    @GetMapping("/instant/admin")
    public ResponseEntity<List<InstantBuyRequestResponse>> getAllInstantBuyRequests(
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "즉시 구매 요청 상태", example = "PENDING")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(purchaseRequestService.getAllInstantBuyRequests(category, status, searchType, keyword));
    }

    @Operation(summary = "즉시 구매 요청 승인", description = "특정 즉시 구매 요청을 승인. 승인 후 해당 상품은 경매 종료(판매 종료)")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 승인 성공")
    @PostMapping("/instant/{requestId}/approve")
    public ResponseEntity<Void> approveInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "승인 대상 즉시 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.approveInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "즉시 구매 요청 거부", description = "특정 즉시 구매 요청을 거부. 경매는 계속 진행.")
    @ApiResponse(responseCode = "200", description = "즉시 구매 요청 거부 성공")
    @PostMapping("/instant/{requestId}/reject")
    public ResponseEntity<Void> rejectInstantBuyRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "거부 대상 즉시 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.rejectInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "구매 요청 목록 조회", description = "특정 사용자의 자신의 구매 요청 목록 조회")
    @ApiResponse(responseCode = "200", description = "구매 요청 목록 조회 성공")
    @GetMapping("/me")
    public ResponseEntity<List<PurchaseRequestResponse>> getMyPurchaseRequests(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "요청 상태", example = "PENDING")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(purchaseRequestService.getUserPurchaseRequests(userId, category, status, searchType, keyword));
    }

    @Operation(summary = "들어온 구매 요청 목록 조회", description = "내가 판매 등록한 상품에 대해 들어온 구매 요청 목록 조회")
    @ApiResponse(responseCode = "200", description = "들어온 구매 요청 목록 조회 성공")
    @GetMapping("/seller")
    public ResponseEntity<List<PurchaseRequestResponse>> getIncomingPurchaseRequests(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "요청 상태", example = "PENDING")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/구매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(purchaseRequestService.getSellerPurchaseRequests(userId, category, status, searchType, keyword));
    }

    @Operation(summary = "들어온 구매 요청 승인", description = "내가 판매 등록한 상품에 대해 들어온 구매 요청 승인")
    @ApiResponse(responseCode = "200", description = "구매 요청 승인 성공")
    @PostMapping("/{requestId}/approve")
    public ResponseEntity<Void> approvePurchaseRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "승인 대상 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.approvePurchaseRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "들어온 구매 요청 거부", description = "내가 판매 등록한 상품에 대해 들어온 구매 요청 거부")
    @ApiResponse(responseCode = "200", description = "구매 요청 거부 성공")
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<Void> rejectPurchaseRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "거부 대상 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.rejectPurchaseRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "보낸 구매 요청 취소", description = "보낸 구매 요청 취소")
    @ApiResponse(responseCode = "200", description = "구매 요청 취소 성공")
    @PostMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancelPurchaseRequest(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "요청 취소할 구매 요청 ID")
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.cancelPurchaseRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }
}
