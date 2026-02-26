package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.sale.auction.dto.AuctionRegisterRequest;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuctionService {

    private final ProductRepository productRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long registerAuction(Long userId, AuctionRegisterRequest request, String imageUrl) {
        log.info("Registering auction for user: {}, product: {}", userId, request.getProductName());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Product product = Product.builder()
                .user(user)
                .productName(request.getProductName())
                .description(request.getDescription())
                .imageUrl(imageUrl)
                .salesStatus(SalesStatus.AUCTION)
                .category(request.getCategory())
                .build();
        productRepository.save(product);

        Auction auction = Auction.createAuction(
                product,
                user,
                request.getEndedAt(),
                request.getStartPrice(),
                request.getMinBidIncrement(),
                request.getInstantPurchasePrice(),
                request.getPriceUnit()
        );
        auctionRepository.save(auction);

        return auction.getAuctionId();
    }
}
