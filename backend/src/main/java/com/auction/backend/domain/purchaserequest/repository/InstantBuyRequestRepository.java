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
}
