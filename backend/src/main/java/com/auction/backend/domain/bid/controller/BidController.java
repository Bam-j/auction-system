package com.auction.backend.domain.bid.controller;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.service.BidCommandService;
import com.auction.backend.domain.bid.service.BidQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Bid", description = "경매 입찰 API")
@RestController
@RequestMapping("/api/v1/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidCommandService bidCommandService;
    private final BidQueryService bidQueryService;

    @Operation(summary = "입찰 생성", description = "입찰 단위에 따른 현재 최고가 입찰 생성")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "입찰 생성 성공"),
            @ApiResponse(responseCode = "404", description = "요청한 사용자나 경매를 찾을 수 없음"),
            @ApiResponse(responseCode = "409", description = "자신의 경매에는 입찰 불가, 입찰 요청 금액/단위가 잘못됨")
    })
    @PostMapping
    public ResponseEntity<Long> createBid(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "입찰 정보. 경매 ID, 입찰가 정보를 가진 DTO")
            @Valid @RequestBody BidCreateRequest request) {
        Long userId = Long.parseLong(principal.getUsername());
        Long bidId = bidCommandService.createBid(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(bidId);
    }

    @Operation(summary = "입찰 기록 조회", description = "자신이 입찰했던 모든 기록을 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "입찰 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "요청한 사용자를 찾을 수 없음")

    })
    @GetMapping("/me")
    public ResponseEntity<List<BidResponse>> getMyBids(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "상품 카테고리", example = "WEAPON")
            @RequestParam(required = false) String category,
            @Parameter(description = "판매 상태", example = "SOLD_OUT")
            @RequestParam(required = false) String status,
            @Parameter(description = "검색 타입 (상품명/판매자)", example = "PRODUCT_NAME")
            @RequestParam(required = false) String searchType,
            @Parameter(description = "검색어", example = "나무 검")
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(bidQueryService.getMyBids(userId, category, status, searchType, keyword));
    }
}
