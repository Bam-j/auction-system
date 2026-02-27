package com.auction.backend.domain.sale.auction.repository;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.sale.auction.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    Optional<Auction> findByProduct(Product product);
}
