package com.auction.backend.domain.fixedsalesorder.entity;

import com.auction.backend.domain.purchaserequest.entity.PurchaseRequest;
import com.auction.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "fixed_sales_orders")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedSalesOrder extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_request_id", nullable = false)
    private PurchaseRequest purchaseRequest;

    @Column(name = "final_price", nullable = false, length = 100)
    private String finalPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Builder
    public FixedSalesOrder(PurchaseRequest purchaseRequest, String finalPrice, Integer quantity) {
        this.purchaseRequest = purchaseRequest;
        this.finalPrice = finalPrice;
        this.quantity = quantity;
    }

    public static FixedSalesOrder createOrder(PurchaseRequest purchaseRequest, String finalPrice, Integer quantity) {
        return FixedSalesOrder.builder()
                .purchaseRequest(purchaseRequest)
                .finalPrice(finalPrice)
                .quantity(quantity)
                .build();
    }
}