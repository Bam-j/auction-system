package com.auction.backend.domain.bid.repository;

import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByUserOrderByCreatedAtDesc(User user);
}
