package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.service.ProductCommandService;
import com.auction.backend.domain.sale.fixedsale.dto.FixedSaleRegisterRequest;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
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
public class FixedSaleCommandService {

    private final ProductCommandService productCommandService;
    private final FixedSaleRepository fixedSaleRepository;
    private final UserQueryService userQueryService;

    //일반 판매(고정가 판매) 상품 등록
    public Long registerFixedSale(Long userId, FixedSaleRegisterRequest request, String imageUrl) {
        log.info("Registering fixed sale for user: {}, product: {}, price: {}, stock: {}, category: {}",
                userId, request.getProductName(), request.getPrice(), request.getStock(), request.getCategory());

        User user = userQueryService.getUser(userId);

        Product product = productCommandService.createProduct(
                user,
                request.getProductName(),
                request.getDescription(),
                imageUrl,
                request.getCategory()
        );

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
