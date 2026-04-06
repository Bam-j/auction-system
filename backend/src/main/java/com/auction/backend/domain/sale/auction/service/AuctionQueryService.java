package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.global.exception.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import com.auction.backend.domain.product.entity.Product;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuctionQueryService {

    private final AuctionRepository auctionRepository;

    public Auction getAuction(Long auctionId) {
        return auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("경매 정보를 찾을 수 없습니다."));
    }

    public Optional<Auction> getAuctionByProduct(Product product) {
        return auctionRepository.findByProduct(product);
    }
}
