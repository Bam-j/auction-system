package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.sale.fixedsale.dto.FixedSaleRegisterRequest;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FixedSaleService {

    private final ProductRepository productRepository;
    private final FixedSaleRepository fixedSaleRepository;
    private final com.auction.backend.domain.user.repository.UserRepository userRepository;

    @Transactional
    public Long registerFixedSale(Long userId, FixedSaleRegisterRequest request, String imageUrl) {
        log.info("Registering fixed sale for user: {}, product: {}, price: {}, stock: {}, category: {}", 
                userId, request.getProductName(), request.getPrice(), request.getStock(), request.getCategory());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Product product = Product.createProduct(
                user,
                request.getProductName(),
                request.getDescription(),
                imageUrl != null ? imageUrl : request.getImageUrl(),
                request.getCategory()
        );
        productRepository.save(product);

        FixedSale fixedSale = FixedSale.createFixedSale(
                product,
                user,
                request.getPrice(),
                request.getStock()
        );
        fixedSaleRepository.save(fixedSale);

        return fixedSale.getFixedSaleId();
    }
}
