package com.auction.backend.domain.bid.repository;

import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;

import java.util.List;

public interface BidRepositoryCustom {
    List<Bid> findByFiltersWithQueryDSL(
            ProductCategory category,
            BidStatus status,
            String searchType,
            String keyword);

    List<Bid> findByUserWithFiltersWithQueryDSL(
            User user,
            ProductCategory category,
            BidStatus status,
            String searchType,
            String keyword);
}
