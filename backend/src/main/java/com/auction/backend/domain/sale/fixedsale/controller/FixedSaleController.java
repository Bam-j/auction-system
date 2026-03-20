package com.auction.backend.domain.sale.fixedsale.controller;

import com.auction.backend.domain.sale.fixedsale.dto.FixedSaleRegisterRequest;
import com.auction.backend.domain.sale.fixedsale.service.FixedSaleCommandService;
import com.auction.backend.global.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Fixed Sales", description = "일반 판매 상품 API")
@RestController
@RequestMapping("/api/v1/fixed-sales")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class FixedSaleController {

    private final FixedSaleCommandService fixedSaleCommandService;
    private final FileService fileService;

    @Operation(summary = "일반 판매 상품 등록", description = "일반 판매(구매 요청 - 승인/거부) 방식으로 판매할 상품 등록")
    @ApiResponse(responseCode = "200", description = "일반 판매 상품 등록 성공")
    @PostMapping
    public ResponseEntity<Map<String, Long>> registerFixedSale(
            @Parameter(hidden = true)
            @AuthenticationPrincipal User principal,
            @Parameter(description = "일반 판매 상품 정보. " +
                    "상품명, 상품 설명(optional), 상품 카테고리, 판매가, 재고, 상품 이미지와 경로(optional) " +
                    "정보를 가진 DTO")
            @Valid @ModelAttribute FixedSaleRegisterRequest request) {
        
        log.info("Received register request: productName={}, price={}, stock={}, category={}, hasImage={}", 
                request.getProductName(), request.getPrice(), request.getStock(), request.getCategory(), request.getImage() != null);

        String imageUrl = fileService.uploadFile(request.getImage());
        
        Long userId = Long.parseLong(principal.getUsername());
        Long fixedSaleId = fixedSaleCommandService.registerFixedSale(userId, request, imageUrl);

        return ResponseEntity.ok(Map.of("fixedSaleId", fixedSaleId));
    }
}
