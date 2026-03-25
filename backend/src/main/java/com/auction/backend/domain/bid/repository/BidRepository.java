package com.auction.backend.domain.bid.repository;

import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long>, BidRepositoryCustom {
    List<Bid> findByUserOrderByCreatedAtDesc(User user);

    Optional<Bid> findTopByAuctionOrderByBidPriceDesc(Auction auction);

    List<Bid> findByAuctionOrderByBidPriceDesc(Auction auction);

    @Query("SELECT b FROM Bid b WHERE " +
            "(:category IS NULL OR b.auction.product.category = :category) AND " +
            "(:status IS NULL OR b.bidStatus = :status) AND " +
            "(:keyword IS NULL OR " +
            "  (:searchType = 'productName' AND b.auction.product.productName LIKE %:keyword%) OR " +
            "  (:searchType = 'seller' AND (b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType = 'bidder' AND (b.user.username LIKE %:keyword% OR b.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType IS NULL AND (b.auction.product.productName LIKE %:keyword% OR b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword% OR b.user.username LIKE %:keyword% OR b.user.nickname LIKE %:keyword%))" +
            ")")
    List<Bid> findByFilters(
            @Param("category") ProductCategory category,
            @Param("status") BidStatus status,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword);

    @Query("SELECT b FROM Bid b WHERE b.user = :user AND " +
            "(:category IS NULL OR b.auction.product.category = :category) AND " +
            "(:status IS NULL OR b.bidStatus = :status) AND " +
            "(:keyword IS NULL OR " +
            "  (:searchType = 'productName' AND b.auction.product.productName LIKE %:keyword%) OR " +
            "  (:searchType = 'seller' AND (b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType IS NULL AND (b.auction.product.productName LIKE %:keyword% OR b.auction.user.username LIKE %:keyword% OR b.auction.user.nickname LIKE %:keyword%))" +
            ") ORDER BY b.createdAt DESC")
    List<Bid> findByUserWithFilters(
            @Param("user") User user,
            @Param("category") ProductCategory category,
            @Param("status") BidStatus status,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword);
}
