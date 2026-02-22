package com.auction.backend.domain.purchaserequest.entity;

import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequestStatus;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "purchase_requests")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurchaseRequest extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_request_id")
    private Long purchaseRequestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fixed_sales_id", nullable = false)
    private FixedSale fixedSale;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "purchase_request_status", nullable = false)
    private PurchaseRequestStatus purchaseRequestStatus;

    @Builder
    public PurchaseRequest(User user, FixedSale fixedSale, Integer quantity, PurchaseRequestStatus status) {
        this.user = user;
        this.fixedSale = fixedSale;
        this.quantity = quantity != null ? quantity : 1;
        this.purchaseRequestStatus = status != null ? status : PurchaseRequestStatus.PENDING;
    }

    public static PurchaseRequest createPurchaseRequest(User user, FixedSale fixedSale, Integer quantity) {
        return PurchaseRequest.builder()
                .user(user)
                .fixedSale(fixedSale)
                .quantity(quantity)
                .status(PurchaseRequestStatus.PENDING)
                .build();
    }
}