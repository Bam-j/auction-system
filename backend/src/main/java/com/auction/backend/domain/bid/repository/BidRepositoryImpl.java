package com.auction.backend.domain.bid.repository;

import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.domain.bid.entity.QBid;
import com.auction.backend.domain.product.entity.QProduct;
import com.auction.backend.domain.sale.auction.entity.QAuction;
import com.auction.backend.domain.user.entity.QUser;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BidRepositoryImpl implements BidRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Bid> findByFiltersWithQueryDSL(
            ProductCategory category,
            BidStatus status,
            String searchType,
            String keyword) {

        QBid bid = QBid.bid;
        QAuction auction = QAuction.auction;
        QProduct product = QProduct.product;
        QUser bidder = QUser.user;
        QUser seller = new QUser("seller");

        return queryFactory
                .selectFrom(bid)
                .leftJoin(bid.auction, auction).fetchJoin()
                .leftJoin(auction.product, product).fetchJoin()
                .leftJoin(bid.user, bidder).fetchJoin()
                .leftJoin(product.user, seller).fetchJoin()
                .where(
                        categoryEq(category),
                        statusEq(status),
                        searchKeyword(searchType, keyword)
                )
                .orderBy(bid.createdAt.desc())
                .fetch();
    }

    @Override
    public List<Bid> findByUserWithFiltersWithQueryDSL(
            User userEntity,
            ProductCategory category,
            BidStatus status,
            String searchType,
            String keyword) {

        QBid bid = QBid.bid;
        QAuction auction = QAuction.auction;
        QProduct product = QProduct.product;
        QUser seller = new QUser("seller");

        return queryFactory
                .selectFrom(bid)
                .leftJoin(bid.auction, auction).fetchJoin()
                .leftJoin(auction.product, product).fetchJoin()
                .leftJoin(product.user, seller).fetchJoin()
                .where(
                        bid.user.eq(userEntity),
                        categoryEq(category),
                        statusEq(status),
                        searchKeyword(searchType, keyword)
                )
                .orderBy(bid.createdAt.desc())
                .fetch();
    }

    private BooleanExpression categoryEq(ProductCategory category) {
        return category != null ? QProduct.product.category.eq(category) : null;
    }

    private BooleanExpression statusEq(BidStatus status) {
        return status != null ? QBid.bid.bidStatus.eq(status) : null;
    }

    private BooleanExpression searchKeyword(String searchType, String keyword) {
        if (keyword == null || keyword.isEmpty()) return null;

        QBid bid = QBid.bid;
        QProduct product = QProduct.product;
        QUser bidder = QUser.user;

        if ("productName".equals(searchType)) {
            return product.productName.containsIgnoreCase(keyword);
        } else if ("bidder".equals(searchType)) {
            return bidder.username.containsIgnoreCase(keyword)
                    .or(bidder.nickname.containsIgnoreCase(keyword));
        } else {
            return product.productName.containsIgnoreCase(keyword)
                    .or(bidder.username.containsIgnoreCase(keyword))
                    .or(bidder.nickname.containsIgnoreCase(keyword));
        }
    }
}
