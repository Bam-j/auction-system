package com.auction.backend.domain.admin.controller;

import com.auction.backend.domain.admin.service.AdminService;
import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestResponse;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductListResponse>> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    @GetMapping("/purchase-requests")
    public ResponseEntity<List<PurchaseRequestResponse>> getAllPurchaseRequests() {
        return ResponseEntity.ok(adminService.getAllPurchaseRequests());
    }

    @GetMapping("/bids")
    public ResponseEntity<List<BidResponse>> getAllBids() {
        return ResponseEntity.ok(adminService.getAllBids());
    }
}
