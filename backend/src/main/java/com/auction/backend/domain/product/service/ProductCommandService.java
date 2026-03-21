package com.auction.backend.domain.product.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductCommandService {

    private final ProductQueryService productQueryService;
    private final ProductRepository productRepository;

    //상품 등록
    public Product createProduct(
            User user,
            String productName,
            String description,
            String imageUrl,
            ProductCategory category
    ) {
        Product product = Product.builder()
                .user(user)
                .productName(productName)
                .description(description)
                .imageUrl(imageUrl)
                .salesStatus(SalesStatus.AUCTION)
                .category(category)
                .build();

        return productRepository.save(product);
    }

    //상품 판매 종료
    public void endSale(Long productId, Long userId) {
        Product product = productQueryService.getProduct(productId);

        if (!product.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("상품 소유자만 판매를 종료할 수 있습니다.");
        }

        product.soldOut();
    }
}
