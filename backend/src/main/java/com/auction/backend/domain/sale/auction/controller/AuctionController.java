package com.auction.backend.domain.sale.auction.controller;

import com.auction.backend.domain.sale.auction.dto.AuctionRegisterRequest;
import com.auction.backend.domain.sale.auction.service.AuctionService;
import com.auction.backend.global.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final FileService fileService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> registerAuction(
            @AuthenticationPrincipal User principal,
            @Valid @ModelAttribute AuctionRegisterRequest request) {

        log.info("Auction POST request received for product: {}", request.getProductName());

        String imageUrl = fileService.uploadFile(request.getImage());

        Long userId = Long.parseLong(principal.getUsername());
        Long auctionId = auctionService.registerAuction(userId, request, imageUrl);

        return ResponseEntity.ok(Map.of("auctionId", auctionId));
    }
}
