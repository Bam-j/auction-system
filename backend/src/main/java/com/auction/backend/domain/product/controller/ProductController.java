package com.auction.backend.domain.product.controller;

import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductListResponse>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(productService.getAllProducts(category, status, searchType, keyword));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProductListResponse>> getMyProducts(
            @AuthenticationPrincipal User principal,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        Long userId = Long.parseLong(principal.getUsername());
        return ResponseEntity.ok(productService.getUserProducts(userId, category, status, keyword));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductListResponse> getProductDetail(
            @PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductDetail(productId));
    }

    @PostMapping("/{productId}/end")
    public ResponseEntity<Void> endSale(
            @AuthenticationPrincipal User principal,
            @PathVariable Long productId) {
        Long userId = Long.parseLong(principal.getUsername());
        productService.endSale(productId, userId);
        return ResponseEntity.ok().build();
    }
}
