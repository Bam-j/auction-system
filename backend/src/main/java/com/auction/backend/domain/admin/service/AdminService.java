package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.bid.service.BidService;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.product.service.ProductService;
import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestResponse;
import com.auction.backend.domain.purchaserequest.entity.PurchaseRequest;
import com.auction.backend.domain.purchaserequest.repository.PurchaseRequestRepository;
import com.auction.backend.domain.purchaserequest.service.PurchaseRequestService;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;
    private final BidRepository bidRepository;
    private final ProductService productService;
    private final PurchaseRequestService purchaseRequestService;
    private final BidService bidService;

    public List<UserResponse> getAllUsers(String keyword, String status) {
        UserStatus userStatus = null;
        if (status != null && !status.equals("ALL") && !status.isEmpty()) {
            userStatus = UserStatus.valueOf(status);
        }

        String searchKeyword = keyword;
        if (keyword != null && keyword.isEmpty()) {
            searchKeyword = null;
        }

        return userRepository.findByKeywordAndStatus(searchKeyword, userStatus).stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    public List<ProductListResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> productService.getProductDetail(product.getProductId()))
                .collect(Collectors.toList());
    }

    public List<PurchaseRequestResponse> getAllPurchaseRequests() {
        return purchaseRequestRepository.findAll().stream()
                .map(purchaseRequestService::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BidResponse> getAllBids() {
        return bidRepository.findAll().stream()
                .map(bidService::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void blockUser(Long userId) {
        com.auction.backend.domain.user.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.block();
    }

    @Transactional
    public void unblockUser(Long userId) {
        com.auction.backend.domain.user.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.unblock();
    }
}
