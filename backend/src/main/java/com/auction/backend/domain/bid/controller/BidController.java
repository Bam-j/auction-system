package com.auction.backend.domain.bid.controller;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    public ResponseEntity<Long> createBid(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody BidCreateRequest request) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(bidService.createBid(userId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<BidResponse>> getMyBids(
            @AuthenticationPrincipal User principal) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(bidService.getMyBids(userId));
    }
}
