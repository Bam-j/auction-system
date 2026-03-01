package com.auction.backend.domain.product.entity;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.entity.BaseTimeEntity;
import com.auction.backend.global.enums.ProductCategory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "products")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "product_name", length = 100)
    private String productName;

    @Column(length = 255)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "sales_status", nullable = false)
    private SalesStatus salesStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Builder
    public Product(User user, String productName, String description, String imageUrl, SalesStatus salesStatus, ProductCategory category) {
        this.user = user;
        this.productName = productName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.salesStatus = salesStatus != null ? salesStatus : SalesStatus.FIXED_SALES;
        this.category = category != null ? category : ProductCategory.ETC;
    }

    public static Product createProduct(User user, String productName, String description, String imageUrl, ProductCategory category) {
        return Product.builder()
                .user(user)
                .productName(productName)
                .description(description)
                .imageUrl(imageUrl)
                .salesStatus(SalesStatus.FIXED_SALES)
                .category(category)
                .build();
    }

    public void soldOut() {
        this.salesStatus = SalesStatus.SOLD_OUT;
    }
}