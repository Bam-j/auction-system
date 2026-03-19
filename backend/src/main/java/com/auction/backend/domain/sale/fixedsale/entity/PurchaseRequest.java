package com.auction.backend.domain.sale.fixedsale.entity;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.entity.BaseTimeEntity;
import com.auction.backend.global.enums.RequestStatus;
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
    @Column(name = "request_status", nullable = false)
    private RequestStatus requestStatus = RequestStatus.PENDING;

    @Builder
    public PurchaseRequest(User user, FixedSale fixedSale, Integer quantity, RequestStatus requestStatus) {
        this.user = user;
        this.fixedSale = fixedSale;
        this.quantity = quantity != null ? quantity : 1;
        if (requestStatus != null) {
            this.requestStatus = requestStatus;
        }
    }

    public static PurchaseRequest createPurchaseRequest(User user, FixedSale fixedSale, Integer quantity) {
        return PurchaseRequest.builder()
                .user(user)
                .fixedSale(fixedSale)
                .quantity(quantity)
                .requestStatus(RequestStatus.PENDING)
                .build();
    }

    public void approve() {
        if (this.requestStatus != RequestStatus.PENDING) {
            throw new IllegalStateException("대기 중인 요청만 수락할 수 있습니다.");
        }
        this.requestStatus = RequestStatus.APPROVED;
    }

    public void reject() {
        if (this.requestStatus != RequestStatus.PENDING) {
            throw new IllegalStateException("대기 중인 요청만 거절할 수 있습니다.");
        }
        this.requestStatus = RequestStatus.REJECTED;
    }
}
