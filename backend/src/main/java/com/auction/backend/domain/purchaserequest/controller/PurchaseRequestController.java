package com.auction.backend.domain.purchaserequest.controller;

import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestResponse;
import com.auction.backend.domain.purchaserequest.service.PurchaseRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/purchase-requests")
@RequiredArgsConstructor
public class PurchaseRequestController {

    private final PurchaseRequestService purchaseRequestService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> createPurchaseRequest(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody PurchaseRequestCreateRequest request) {
        
        Long userId = Long.parseLong(principal.getUsername());
        Long purchaseRequestId = purchaseRequestService.createPurchaseRequest(userId, request);

        return ResponseEntity.ok(Map.of("purchaseRequestId", purchaseRequestId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<PurchaseRequestResponse>> getMyPurchaseRequests(
            @AuthenticationPrincipal User principal) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(purchaseRequestService.getUserPurchaseRequests(userId));
    }

    @GetMapping("/seller")
    public ResponseEntity<List<PurchaseRequestResponse>> getIncomingPurchaseRequests(
            @AuthenticationPrincipal User principal) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(purchaseRequestService.getSellerPurchaseRequests(userId));
    }

    @PostMapping("/{requestId}/approve")
    public ResponseEntity<Void> approvePurchaseRequest(
            @AuthenticationPrincipal User principal,
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.approvePurchaseRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<Void> rejectPurchaseRequest(
            @AuthenticationPrincipal User principal,
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.rejectPurchaseRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancelPurchaseRequest(
            @AuthenticationPrincipal User principal,
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.cancelPurchaseRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }
}
