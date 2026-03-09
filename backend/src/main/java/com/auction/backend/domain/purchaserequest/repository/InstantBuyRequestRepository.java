package com.auction.backend.domain.purchaserequest.repository;

import com.auction.backend.domain.purchaserequest.entity.InstantBuyRequest;
import com.auction.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstantBuyRequestRepository extends JpaRepository<InstantBuyRequest, Long> {
    List<InstantBuyRequest> findByUser(User user);

    @Query("SELECT ibr FROM InstantBuyRequest ibr WHERE ibr.auction.user = :seller")
    List<InstantBuyRequest> findBySeller(@Param("seller") User seller);

    @Query("SELECT ibr FROM InstantBuyRequest ibr WHERE " +
            "(:category IS NULL OR ibr.auction.product.category = :category) AND " +
            "(:status IS NULL OR ibr.requestStatus = :status) AND " +
            "(:keyword IS NULL OR " +
            "  (:searchType = 'productName' AND ibr.auction.product.productName LIKE %:keyword%) OR " +
            "  (:searchType = 'requester' AND (ibr.user.username LIKE %:keyword% OR ibr.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType = 'seller' AND (ibr.auction.user.username LIKE %:keyword% OR ibr.auction.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType IS NULL AND (ibr.auction.product.productName LIKE %:keyword% OR ibr.user.username LIKE %:keyword% OR ibr.user.nickname LIKE %:keyword% OR ibr.auction.user.username LIKE %:keyword% OR ibr.auction.user.nickname LIKE %:keyword%))" +
            ")")
    List<InstantBuyRequest> findByFilters(
            @Param("category") com.auction.backend.global.enums.ProductCategory category,
            @Param("status") com.auction.backend.global.enums.RequestStatus status,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword);
}
