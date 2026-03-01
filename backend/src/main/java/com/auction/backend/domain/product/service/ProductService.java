package com.auction.backend.domain.product.service;

import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final FixedSaleRepository fixedSaleRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    public List<ProductListResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductListResponse> getUserProducts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return productRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductListResponse getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        return convertToResponse(product);
    }

    @Transactional
    public void endSale(Long productId, Long userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("상품 소유자만 판매를 종료할 수 있습니다.");
        }

        product.soldOut();
    }

    private ProductListResponse convertToResponse(Product product) {
        String type = "FIXED";
        String price = "0";
        String priceUnit = "원";
        Integer stock = null;
        java.time.LocalDateTime endedAt = null;
        Integer startPrice = null;
        Integer currentPrice = null;
        Integer bidIncrement = null;
        String instantPrice = null;

        var fixedSaleOpt = fixedSaleRepository.findByProduct(product);
        if (fixedSaleOpt.isPresent()) {
            var fixedSale = fixedSaleOpt.get();
            price = fixedSale.getPrice();
            type = "FIXED";
            priceUnit = "원";
            stock = fixedSale.getStock();
        } else {
            var auctionOpt = auctionRepository.findByProduct(product);
            if (auctionOpt.isPresent()) {
                var auction = auctionOpt.get();
                price = String.valueOf(auction.getCurrentPrice());
                type = "AUCTION";
                priceUnit = getPriceUnitDisplayName(auction.getPriceUnit());
                endedAt = auction.getEndedAt();
                startPrice = auction.getStartPrice();
                currentPrice = auction.getCurrentPrice();
                bidIncrement = auction.getMinBidIncrement();
                instantPrice = auction.getInstantPurchasePrice();
            }
        }

        return ProductListResponse.builder()
                .id(product.getProductId())
                .title(product.getProductName())
                .seller(product.getUser().getNickname())
                .price(price)
                .priceUnit(priceUnit)
                .imageUrl(product.getImageUrl())
                .status(product.getSalesStatus())
                .type(type)
                .category(product.getCategory())
                .description(product.getDescription())
                .stock(stock)
                .createdAt(product.getCreatedAt())
                .endedAt(endedAt)
                .startPrice(startPrice)
                .currentPrice(currentPrice)
                .bidIncrement(bidIncrement)
                .instantPrice(instantPrice)
                .build();
    }

    private String getPriceUnitDisplayName(com.auction.backend.global.enums.PriceUnit unit) {
        if (unit == null) return "원";
        return switch (unit) {
            case EMERALD -> "에메랄드";
            case EMERALD_BLOCK -> "에메랄드 블록";
            case EMERALD_COIN -> "에메랄드 주화";
        };
    }
}
