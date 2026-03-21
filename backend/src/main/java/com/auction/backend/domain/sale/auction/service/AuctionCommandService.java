package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.service.ProductCommandService;
import com.auction.backend.domain.sale.auction.dto.AuctionRegisterRequest;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuctionCommandService {

    private final AuctionRepository auctionRepository;
    private final UserQueryService userQueryService;
    private final ProductCommandService productCommandService;

    //경매 상품 등록
    public Long registerAuction(Long userId, AuctionRegisterRequest request, String imageUrl) {
        log.info("Registering auction for user: {}, product: {}", userId, request.getProductName());

        User user = userQueryService.getUser(userId);
        Product product = productCommandService.createProduct(
                user,
                request.getProductName(),
                request.getDescription(),
                imageUrl,
                request.getCategory()
        );

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
