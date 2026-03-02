package com.auction.backend.domain.fixedsalesorder.repository;

import com.auction.backend.domain.fixedsalesorder.entity.FixedSalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FixedSalesOrderRepository extends JpaRepository<FixedSalesOrder, Long> {
}
