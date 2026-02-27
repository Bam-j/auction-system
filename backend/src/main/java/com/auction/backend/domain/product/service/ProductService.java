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

    private ProductListResponse convertToResponse(Product product) {
        String type = "FIXED";
        String price = "0";
        String priceUnit = "원";

        var fixedSaleOpt = fixedSaleRepository.findByProduct(product);
        if (fixedSaleOpt.isPresent()) {
            price = fixedSaleOpt.get().getPrice();
            type = "FIXED";
            priceUnit = "원"; // 일반 판매는 가격 문자열에 단위가 포함될 수 있으므로 기본값 유지
        } else {
            var auctionOpt = auctionRepository.findByProduct(product);
            if (auctionOpt.isPresent()) {
                var auction = auctionOpt.get();
                price = String.valueOf(auction.getCurrentPrice());
                type = "AUCTION";
                priceUnit = getPriceUnitDisplayName(auction.getPriceUnit());
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
                .build();
    }

    private String getPriceUnitDisplayName(com.auction.backend.global.enums.PriceUnit unit) {
        if (unit == null) return "원";
        return switch (unit) {
            case EMERALD -> "에메랄드";
            case EMERALD_BLOCK -> "에메랄드 블록";
            case EMERALD_COIN -> "에메랄드 주화셋";
        };
    }
}
