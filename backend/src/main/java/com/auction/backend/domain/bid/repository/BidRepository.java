package com.auction.backend.domain.bid.repository;

import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByUserOrderByCreatedAtDesc(User user);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Bid b WHERE " +
            "(:category IS NULL OR b.auction.product.category = :category) AND " +
            "(:status IS NULL OR b.bidStatus = :status) AND " +
            "(:keyword IS NULL OR " +
            "  (:searchType = 'seller' AND (b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType = 'bidder' AND (b.user.username LIKE %:keyword% OR b.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType IS NULL AND (b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword% OR b.user.username LIKE %:keyword% OR b.user.nickname LIKE %:keyword%))" +
            ")")
    List<Bid> findByFilters(
            @org.springframework.data.repository.query.Param("category") com.auction.backend.global.enums.ProductCategory category,
            @org.springframework.data.repository.query.Param("status") com.auction.backend.domain.bid.entity.BidStatus status,
            @org.springframework.data.repository.query.Param("searchType") String searchType,
            @org.springframework.data.repository.query.Param("keyword") String keyword);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Bid b WHERE b.user = :user AND " +
            "(:category IS NULL OR b.auction.product.category = :category) AND " +
            "(:status IS NULL OR b.bidStatus = :status) AND " +
            "(:keyword IS NULL OR " +
            "  (:searchType = 'seller' AND (b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType IS NULL AND (b.auction.product.productName LIKE %:keyword% OR b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword%))" +
            ") ORDER BY b.createdAt DESC")
    List<Bid> findByUserWithFilters(
            @org.springframework.data.repository.query.Param("user") User user,
            @org.springframework.data.repository.query.Param("category") com.auction.backend.global.enums.ProductCategory category,
            @org.springframework.data.repository.query.Param("status") com.auction.backend.domain.bid.entity.BidStatus status,
            @org.springframework.data.repository.query.Param("searchType") String searchType,
            @org.springframework.data.repository.query.Param("keyword") String keyword);
}
