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

    @Column(name = "instant_purchase_price")
    private Integer instantPurchasePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_unit")
    private PriceUnit priceUnit;

    @Builder
    public Auction(Product product, User user, LocalDateTime endedAt, Integer startPrice, Integer minBidIncrement, Integer instantPurchasePrice, PriceUnit priceUnit) {
        this.product = product;
        this.user = user;
        this.endedAt = endedAt;
        this.startPrice = startPrice != null ? startPrice : 1;
        this.currentPrice = this.startPrice;
        this.minBidIncrement = minBidIncrement != null ? minBidIncrement : 1;
        this.instantPurchasePrice = instantPurchasePrice;
        this.priceUnit = priceUnit != null ? priceUnit : PriceUnit.EMERALD_BLOCK;
    }

    public static Auction createAuction(Product product, User user, LocalDateTime endedAt, Integer startPrice, Integer minBidIncrement, Integer instantPurchasePrice, PriceUnit priceUnit) {
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

    public void updateCurrentPrice(Integer newPrice) {
        if (newPrice <= this.currentPrice) {
            throw new IllegalArgumentException("입찰 가격은 현재 가격보다 높아야 합니다.");
        }
        if (newPrice < this.currentPrice + this.minBidIncrement) {
            throw new IllegalArgumentException("최소 입찰 단위 이상의 금액으로 입찰해야 합니다.");
        }
        if (LocalDateTime.now().isAfter(this.endedAt)) {
            throw new IllegalStateException("경매가 이미 종료되었습니다.");
        }
        this.currentPrice = newPrice;
    }
}