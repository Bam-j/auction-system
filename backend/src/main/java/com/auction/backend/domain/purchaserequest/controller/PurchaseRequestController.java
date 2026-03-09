package com.auction.backend.domain.purchaserequest.controller;

import com.auction.backend.domain.purchaserequest.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.purchaserequest.dto.InstantBuyRequestResponse;
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

    @PostMapping("/instant")
    public ResponseEntity<Map<String, Long>> createInstantBuyRequest(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody InstantBuyCreateRequest request) {
        
        Long userId = Long.parseLong(principal.getUsername());
        Long instantBuyRequestId = purchaseRequestService.createInstantBuyRequest(userId, request);

        return ResponseEntity.ok(Map.of("instantBuyRequestId", instantBuyRequestId));
    }

    @GetMapping("/instant/me")
    public ResponseEntity<List<InstantBuyRequestResponse>> getMyInstantBuyRequests(
            @AuthenticationPrincipal User principal,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(purchaseRequestService.getUserInstantBuyRequests(userId, category, status, keyword));
    }

    @GetMapping("/instant/admin")
    public ResponseEntity<List<InstantBuyRequestResponse>> getAllInstantBuyRequests(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(purchaseRequestService.getAllInstantBuyRequests(category, status, searchType, keyword));
    }

    @PostMapping("/instant/{requestId}/approve")
    public ResponseEntity<Void> approveInstantBuyRequest(
            @AuthenticationPrincipal User principal,
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.approveInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/instant/{requestId}/reject")
    public ResponseEntity<Void> rejectInstantBuyRequest(
            @AuthenticationPrincipal User principal,
            @PathVariable Long requestId) {
        Long userId = Long.parseLong(principal.getUsername());
        purchaseRequestService.rejectInstantBuyRequest(userId, requestId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<PurchaseRequestResponse>> getMyPurchaseRequests(
            @AuthenticationPrincipal User principal,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(purchaseRequestService.getUserPurchaseRequests(userId, category, status, searchType, keyword));
    }

    @GetMapping("/seller")
    public ResponseEntity<List<PurchaseRequestResponse>> getIncomingPurchaseRequests(
            @AuthenticationPrincipal User principal,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(purchaseRequestService.getSellerPurchaseRequests(userId, category, status, searchType, keyword));
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
