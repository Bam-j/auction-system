package com.auction.backend.domain.sale.auction.entity;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "instant_buy_requests")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InstantBuyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "instant_buy_request_id")
    private Long instantBuyRequestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_status", nullable = false)
    private RequestStatus requestStatus = RequestStatus.PENDING;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public InstantBuyRequest(User user, Auction auction, RequestStatus requestStatus) {
        this.user = user;
        this.auction = auction;
        if (requestStatus != null) {
            this.requestStatus = requestStatus;
        }
    }

    public static InstantBuyRequest createInstantBuyRequest(User user, Auction auction) {
        return InstantBuyRequest.builder()
                .user(user)
                .auction(auction)
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
