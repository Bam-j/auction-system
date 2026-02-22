package com.auction.backend.domain.sale.auction.entity;

import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "auctions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Auction extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_id")
    private Long auctionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "ended_at", nullable = false)
    private LocalDateTime endedAt;

    @Column(name = "start_price", nullable = false)
    private Integer startPrice;

    // ★ 현재 최고가 필드
    @Column(name = "current_price", nullable = false)
    private Integer currentPrice;

    @Column(name = "min_bid_increment", nullable = false)
    private Integer minBidIncrement;

    @Column(name = "instant_purchase_price", length = 100)
    private String instantPurchasePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_unit")
    private PriceUnit priceUnit;

    @Builder
    public Auction(Product product, User user, LocalDateTime endedAt, Integer startPrice, Integer minBidIncrement, String instantPurchasePrice, PriceUnit priceUnit) {
        this.product = product;
        this.user = user;
        this.endedAt = endedAt;
        this.startPrice = startPrice != null ? startPrice : 1;
        this.currentPrice = this.startPrice;
        this.minBidIncrement = minBidIncrement != null ? minBidIncrement : 1;
        this.instantPurchasePrice = instantPurchasePrice;
        this.priceUnit = priceUnit != null ? priceUnit : PriceUnit.EMERALD_BLOCK;
    }

    public static Auction createAuction(Product product, User user, LocalDateTime endedAt, Integer startPrice, Integer minBidIncrement, String instantPurchasePrice, PriceUnit priceUnit) {
        return Auction.builder()
                .product(product)
                .user(user)
                .endedAt(endedAt)
                .startPrice(startPrice)
                .minBidIncrement(minBidIncrement)
                .instantPurchasePrice(instantPurchasePrice)
                .priceUnit(priceUnit)
                .build();
    }
}