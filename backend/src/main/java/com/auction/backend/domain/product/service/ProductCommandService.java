package com.auction.backend.domain.product.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.global.exception.ResourceNotFoundException;
import com.auction.backend.global.exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductCommandService {

    private final ProductRepository productRepository;

    //상품 판매 종료
    @Transactional
    public void endSale(Long productId, Long userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));

        if (!product.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("상품 소유자만 판매를 종료할 수 있습니다.");
        }

        product.soldOut();
    }
}
