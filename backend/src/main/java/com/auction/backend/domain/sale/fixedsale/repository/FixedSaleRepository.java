package com.auction.backend.domain.sale.fixedsale.repository;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FixedSaleRepository extends JpaRepository<FixedSale, Long> {
    Optional<FixedSale> findByProduct(Product product);
}
