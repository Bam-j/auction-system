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
}
