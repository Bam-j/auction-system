package com.auction.backend.domain.fixedsalesorder.repository;

import com.auction.backend.domain.fixedsalesorder.entity.FixedSaleOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FixedSaleOrderRepository extends JpaRepository<FixedSaleOrder, Long> {
}
