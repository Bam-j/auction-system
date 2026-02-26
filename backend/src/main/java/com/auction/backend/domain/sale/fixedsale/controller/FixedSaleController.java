package com.auction.backend.domain.sale.fixedsale.controller;

import com.auction.backend.domain.sale.fixedsale.dto.FixedSaleRegisterRequest;
import com.auction.backend.domain.sale.fixedsale.service.FixedSaleService;
import com.auction.backend.global.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/fixed-sales")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class FixedSaleController {

    private final FixedSaleService fixedSaleService;
    private final FileService fileService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> registerFixedSale(
            @AuthenticationPrincipal User principal,
            @Valid @ModelAttribute FixedSaleRegisterRequest request) {
        
        log.info("Received register request: productName={}, price={}, stock={}, category={}, hasImage={}", 
                request.getProductName(), request.getPrice(), request.getStock(), request.getCategory(), request.getImage() != null);

        String imageUrl = fileService.uploadFile(request.getImage());
        
        Long userId = Long.parseLong(principal.getUsername());
        Long fixedSaleId = fixedSaleService.registerFixedSale(userId, request, imageUrl);

        return ResponseEntity.ok(Map.of("fixedSaleId", fixedSaleId));
    }
}
