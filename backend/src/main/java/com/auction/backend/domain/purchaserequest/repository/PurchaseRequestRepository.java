package com.auction.backend.domain.purchaserequest.repository;

import com.auction.backend.domain.purchaserequest.entity.PurchaseRequest;
import com.auction.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByUser(User user);

    @Query("SELECT pr FROM PurchaseRequest pr WHERE pr.fixedSale.user = :seller")
    List<PurchaseRequest> findBySeller(@Param("seller") User seller);

    @Query("SELECT pr FROM PurchaseRequest pr WHERE " +
            "(:category IS NULL OR pr.fixedSale.product.category = :category) AND " +
            "(:status IS NULL OR pr.requestStatus = :status) AND " +
            "(:keyword IS NULL OR " +
            "  (:searchType = 'seller' AND (pr.fixedSale.user.username LIKE %:keyword% OR pr.fixedSale.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType = 'buyer' AND (pr.user.username LIKE %:keyword% OR pr.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType IS NULL AND (pr.fixedSale.user.username LIKE %:keyword% OR pr.fixedSale.user.nickname LIKE %:keyword% OR pr.user.username LIKE %:keyword% OR pr.user.nickname LIKE %:keyword%))" +
            ")")
    List<PurchaseRequest> findByFilters(
            @Param("category") com.auction.backend.global.enums.ProductCategory category,
            @Param("status") com.auction.backend.global.enums.RequestStatus status,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword);
}
