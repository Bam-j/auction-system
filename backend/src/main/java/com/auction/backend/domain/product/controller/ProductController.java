package com.auction.backend.domain.product.controller;

import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.service.ProductCommandService;
import com.auction.backend.domain.product.service.ProductQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Product", description = "상품 API")
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductCommandService productCommandService;
    private final ProductQueryService productQueryService;

    @Operation(summary = "모든 상품 조회", description = "시스템 내에 등록된 모든 상품 조회")
    @ApiResponse(responseCode = "200", description = "상품 목록 조회 성공")
    @GetMapping
    public ResponseEntity<List<ProductListResponse>> getAllProducts(
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "판매 상태", example = "SOLD_OUT")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(productQueryService.getAllProducts(category, status, searchType, keyword));
    }

    @Operation(summary = "사용자의 등록 상품 조회", description = "특정 사용자가 본인이 등록한 상품의 전체 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 상품 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    @GetMapping("/me")
    public ResponseEntity<List<ProductListResponse>> getMyProducts(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "판매 상태", example = "SOLD_OUT")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(productQueryService.getUserProducts(userId, category, status, keyword));
    }

    @Operation(summary = "상품 상세 정보 조회", description = "해당 상품의 상세 정보 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상품 상세 정보 조회 성공"),
            @ApiResponse(responseCode = "404", description = "대상 상품을 찾을 수 없음")
    })
    @GetMapping("/{productId}")
    public ResponseEntity<ProductListResponse> getProductDetail(
            @Parameter(description = "조회 대상 상품 ID", example = "1")
            @PathVariable Long productId) {
        return ResponseEntity.ok(productQueryService.getProductDetail(productId));
    }

    @Operation(summary = "판매 종료", description = "등록자가 수동으로 판매 종료(취소)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "지정된 상품 판매 종료"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "403", description = "등록자가 보낸 요청이 아님"),
            @ApiResponse(responseCode = "404", description = "대상 상품을 찾을 수 없음")
    })
    @PostMapping("/{productId}/end")
    public ResponseEntity<Void> endSale(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "종료 대상 상품 ID", example = "1")
            @PathVariable Long productId) {
        Long userId = Long.parseLong(principal.getUsername());
        productCommandService.endSale(productId, userId);
        return ResponseEntity.noContent().build();
    }
}
