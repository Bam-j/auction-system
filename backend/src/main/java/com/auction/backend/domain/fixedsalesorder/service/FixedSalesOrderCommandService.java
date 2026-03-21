package com.auction.backend.domain.fixedsalesorder.service;

import com.auction.backend.domain.fixedsalesorder.entity.FixedSaleOrder;
import com.auction.backend.domain.fixedsalesorder.repository.FixedSaleOrderRepository;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FixedSalesOrderCommandService {

    private final FixedSaleOrderRepository fixedSaleOrderRepository;

    //일반 판매 기록 생성
    //요청이 승인되면 해당 수량 및 가격을 기록으로 남김.
    public void createFixedSaleOrder(PurchaseRequest request) {
        FixedSaleOrder order = FixedSaleOrder.createOrder(
                request,
                request.getFixedSale().getPrice(),
                request.getQuantity()
        );
        fixedSaleOrderRepository.save(order);
    }
}
