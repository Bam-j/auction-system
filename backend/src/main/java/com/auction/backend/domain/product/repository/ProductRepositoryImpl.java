package com.auction.backend.domain.product.repository;

import com.auction.backend.domain.bid.entity.QBid;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.QProduct;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.entity.QAuction;
import com.auction.backend.domain.sale.fixedsale.entity.QFixedSale;
import com.auction.backend.domain.user.entity.QUser;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ProductListResponse> findByFiltersWithQueryDSL(
            ProductCategory category,
            SalesStatus status,
            String searchType,
            String keyword) {

        QProduct product = QProduct.product;
        QUser user = QUser.user;
        QAuction auction = QAuction.auction;
        QFixedSale fixedSale = QFixedSale.fixedSale;

        List<Product> products = queryFactory
                .selectFrom(product)
                .leftJoin(product.user, user).fetchJoin()
                .where(
                        categoryEq(category),
                        statusEq(status),
                        searchKeyword(searchType, keyword)
                )
                .orderBy(product.createdAt.desc())
                .fetch();

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductListResponse> findByUserWithFiltersWithQueryDSL(
            User userEntity,
            ProductCategory category,
            SalesStatus status,
            String keyword) {

        QProduct product = QProduct.product;

        List<Product> products = queryFactory
                .selectFrom(product)
                .where(
                        product.user.eq(userEntity),
                        categoryEq(category),
                        statusEq(status),
                        productNameLike(keyword)
                )
                .orderBy(product.createdAt.desc())
                .fetch();

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductListResponse findProductDetailWithQueryDSL(Long productId) {
        QProduct product = QProduct.product;
        QUser user = QUser.user;

        Product productEntity = queryFactory
                .selectFrom(product)
                .leftJoin(product.user, user).fetchJoin()
                .where(product.productId.eq(productId))
                .fetchOne();

        return productEntity != null ? mapToResponse(productEntity) : null;
    }

    private ProductListResponse mapToResponse(Product product) {
        QAuction auction = QAuction.auction;
        QFixedSale fixedSale = QFixedSale.fixedSale;
        QBid bid = QBid.bid;

        var auctionEntity = queryFactory.selectFrom(auction)
                .where(auction.product.eq(product))
                .fetchOne();

        var fixedSaleEntity = queryFactory.selectFrom(fixedSale)
                .where(fixedSale.product.eq(product))
                .fetchOne();

        String type = "FIXED";
        String price = "0";
        String priceUnit = "에메랄드";
        Integer stock = null;
        Long auctionId = null;
        Long fixedSaleId = null;
        java.time.LocalDateTime endedAt = null;
        Integer startPrice = null;
        Integer currentPrice = null;
        Integer bidIncrement = null;
        String instantPrice = null;
        String highestBidderNickname = null;
        Long highestBidderId = null;

        if (fixedSaleEntity != null) {
            price = fixedSaleEntity.getPrice();
            type = "FIXED";
            priceUnit = "에메랄드";
            stock = fixedSaleEntity.getStock();
            fixedSaleId = fixedSaleEntity.getFixedSaleId();
        } else if (auctionEntity != null) {
            type = "AUCTION";
            priceUnit = PriceUnit.getDisplayName(auctionEntity.getPriceUnit());
            endedAt = auctionEntity.getEndedAt();
            startPrice = auctionEntity.getStartPrice();
            currentPrice = auctionEntity.getCurrentPrice();
            bidIncrement = auctionEntity.getMinBidIncrement();
            instantPrice = auctionEntity.getInstantPurchasePrice() != null ? String.valueOf(auctionEntity.getInstantPurchasePrice()) : null;
            auctionId = auctionEntity.getAuctionId();

            if (product.getSalesStatus() == SalesStatus.INSTANT_BUY && instantPrice != null) {
                price = instantPrice;
            } else {
                price = String.valueOf(auctionEntity.getCurrentPrice());
            }

            var highestBid = queryFactory.selectFrom(bid)
                    .where(bid.auction.eq(auctionEntity))
                    .orderBy(bid.bidPrice.desc())
                    .fetchFirst();

            if (highestBid != null) {
                highestBidderNickname = highestBid.getUser().getNickname();
                highestBidderId = highestBid.getUser().getUserId();
            }
        }

        return ProductListResponse.builder()
                .id(product.getProductId())
                .auctionId(auctionId)
                .fixedSaleId(fixedSaleId)
                .title(product.getProductName())
                .seller(product.getUser().getNickname())
                .price(price)
                .priceUnit(priceUnit)
                .imageUrl(product.getImageUrl())
                .status(product.getSalesStatus())
                .type(type)
                .category(product.getCategory())
                .description(product.getDescription())
                .stock(stock)
                .createdAt(product.getCreatedAt())
                .endedAt(endedAt)
                .startPrice(startPrice)
                .currentPrice(currentPrice)
                .bidIncrement(bidIncrement)
                .instantPrice(instantPrice)
                .highestBidderNickname(highestBidderNickname)
                .highestBidderId(highestBidderId)
                .build();
    }

    private BooleanExpression categoryEq(ProductCategory category) {
        return category != null ? QProduct.product.category.eq(category) : null;
    }

    private BooleanExpression statusEq(SalesStatus status) {
        return status != null ? QProduct.product.salesStatus.eq(status) : null;
    }

    private BooleanExpression searchKeyword(String searchType, String keyword) {
        if (keyword == null || keyword.isEmpty()) return null;

        QProduct product = QProduct.product;
        if ("productName".equals(searchType)) {
            return product.productName.containsIgnoreCase(keyword);
        } else if ("seller".equals(searchType)) {
            return product.user.username.containsIgnoreCase(keyword)
                    .or(product.user.nickname.containsIgnoreCase(keyword));
        } else {
            return product.productName.containsIgnoreCase(keyword)
                    .or(product.user.username.containsIgnoreCase(keyword))
                    .or(product.user.nickname.containsIgnoreCase(keyword));
        }
    }

    private BooleanExpression productNameLike(String keyword) {
        return keyword != null ? QProduct.product.productName.containsIgnoreCase(keyword) : null;
    }
}
