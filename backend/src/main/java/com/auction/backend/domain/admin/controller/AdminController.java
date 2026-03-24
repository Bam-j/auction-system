package com.auction.backend.domain.admin.controller;

import com.auction.backend.domain.admin.service.AdminCommandService;
import com.auction.backend.domain.admin.service.AdminQueryService;
import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin", description = "관리자 전용 API")
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminCommandService adminCommandService;
    private final AdminQueryService adminQueryService;

    @Operation(summary = "모든 사용자 조회", description = "시스템 내에 등록된 모든 사용자 조회. 키워드 검색과 상태 필터링 제공.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용자 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자")
    })
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @Parameter(description = "검색어 (아이디 또는 닉네임)", example = "im_user000")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "사용자 상태 (ACTIVE, DELETED, BLOCKED)", example = "ACTIVE")
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminQueryService.getAllUsers(keyword, status));
    }

    @Operation(summary = "사용자 차단", description = "특정 사용자를 차단. 차단된 유저는 로그인 불가능")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "지정된 유저 차단 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "지정된 유저를 찾을 수 없음")
    })
    @PostMapping("/users/{userId}/block")
    public ResponseEntity<Void> blockUser(
            @Parameter(description = "차단 대상 유저 ID", example = "1")
            @PathVariable Long userId
    ) {
        adminCommandService.blockUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "사용자 차단 해제", description = "차단된 사용자를 차단 해제.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "지정된 유저 차단 해제 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "지정된 유저를 찾을 수 없음")
    })    @PostMapping("/users/{userId}/unblock")
    public ResponseEntity<Void> unblockUser(
            @Parameter(description = "차단 해제 대상 유저 ID", example = "1")
            @PathVariable Long userId
    ) {
        adminCommandService.unblockUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "모든 상품 조회", description = "시스템에 등록된 모든 상품 조회. 필터링, 검색, 상품 상세 보기 제공")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자")
    })
    @GetMapping("/products")
    public ResponseEntity<List<ProductListResponse>> getAllProducts(
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "판매 상태", example = "SOLD_OUT")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminQueryService.getAllProducts(category, status, searchType, keyword));
    }

    @Operation(summary = "모든 구매 요청 조회", description = "시스템에 등록된 모든 구매 요청 조회. 필터링, 검색, 상품 상세 보기 제공")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "구매 요청 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자")
    })
    @GetMapping("/purchase-requests")
    public ResponseEntity<List<PurchaseRequestResponse>> getAllPurchaseRequests(
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "판매 상태", example = "SOLD_OUT")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/요청자/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminQueryService.getAllPurchaseRequests(category, status, searchType, keyword));
    }

    @Operation(summary = "모든 입찰 조회", description = "시스템에 등록된 모든 입찰 조회. 필터링, 검색, 상품 상세 보기 제공")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "입찰 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자")
    })
    @GetMapping("/bids")
    public ResponseEntity<List<BidResponse>> getAllBids(
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "판매 상태", example = "SOLD_OUT")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/입찰자/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminQueryService.getAllBids(category, status, searchType, keyword));
    }
}
