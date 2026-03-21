package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import com.auction.backend.domain.product.entity.Product;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FixedSaleQueryService {

    private final FixedSaleRepository fixedSaleRepository;

    //일반 판매(고정가 판매) 획득
    public FixedSale getFixedSale(Long fixedSaleId) {
        return fixedSaleRepository.findById(fixedSaleId)
                .orElseThrow(() -> new ResourceNotFoundException("판매 정보를 찾을 수 없습니다."));
    }

    public Optional<FixedSale> getFixedSaleByProduct(Product product) {
        return fixedSaleRepository.findByProduct(product);
    }
}
