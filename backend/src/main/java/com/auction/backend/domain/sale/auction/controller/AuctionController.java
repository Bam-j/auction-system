package com.auction.backend.domain.sale.auction.controller;

import com.auction.backend.domain.sale.auction.dto.AuctionRegisterRequest;
import com.auction.backend.domain.sale.auction.service.AuctionCommandService;
import com.auction.backend.global.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Tag(name = "Auction", description = "경매 API")
@Slf4j
@RestController
@RequestMapping("/api/v1/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionCommandService auctionCommandService;
    private final FileService fileService;

    @Qualifier("taskExecutor")
    private final AsyncTaskExecutor taskExecutor;

    @Operation(summary = "경매 상품 등록", description = "경매 방식으로 판매 상품을 등록")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "경매로 상품 등록 성공"),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "등록자(회원)을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "상품 이미지 등록 실패")
    })
    @PostMapping
    public CompletableFuture<ResponseEntity<Map<String, Long>>> registerAuction(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "경매 상품 정보. " +
                    "상품명, 설명(optional), 상품 카테고리, 경매 마감 시간, " +
                    "시작가, 최소 입찰 단위, 즉시 구매가, 입찰 가격 단위, 상품 이미지(optional) " +
                    "정보를 가진 DTO")
            @Valid @ModelAttribute AuctionRegisterRequest request) {

        log.info("Auction POST request received for product: {}", request.getProductName());

        Long userId = Long.parseLong(principal.getUsername());

        return fileService.uploadFileAsync(request.getImage())
                .thenApplyAsync(imageUrl -> {
                    Long auctionId = auctionCommandService.registerAuction(userId, request, imageUrl);
                    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("auctionId", auctionId));
                }, taskExecutor);
    }
}
