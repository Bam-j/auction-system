package com.auction.backend.domain.bid.entity;

import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "bids")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bid extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id")
    private Long bidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @Column(name = "bid_price", nullable = false)
    private Integer bidPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "bid_status", nullable = false)
    private BidStatus bidStatus;

    @Builder
    public Bid(User user, Auction auction, Integer bidPrice, BidStatus bidStatus) {
        this.user = user;
        this.auction = auction;
        this.bidPrice = bidPrice;
        this.bidStatus = bidStatus != null ? bidStatus : BidStatus.BIDDING;
    }

    public static Bid createBid(User user, Auction auction, Integer bidPrice) {
        return Bid.builder()
                .user(user)
                .auction(auction)
                .bidPrice(bidPrice)
                .bidStatus(BidStatus.BIDDING)
                .build();
    }
}