package com.auction.backend.domain.sale.fixedsale.entity;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "fixed_sales")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedSale extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fixed_sales_id")
    private Long fixedSaleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String price;

    @Column(nullable = false)
    private Integer stock;

    @Builder
    public FixedSale(Product product, User user, String price, Integer stock) {
        this.product = product;
        this.user = user;
        this.price = price != null ? price : "1";
        this.stock = stock != null ? stock : 1;
    }

    public static FixedSale createFixedSale(Product product, User user, String price, Integer stock) {
        return FixedSale.builder()
                .product(product)
                .user(user)
                .price(price)
                .stock(stock)
                .build();
    }
}