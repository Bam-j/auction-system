package com.auction.backend.domain.sale.fixedsale.repository;

import com.auction.backend.domain.product.entity.QProduct;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.entity.QFixedSale;
import com.auction.backend.domain.sale.fixedsale.entity.QPurchaseRequest;
import com.auction.backend.domain.user.entity.QUser;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.enums.RequestStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PurchaseRequestRepositoryImpl implements PurchaseRequestRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PurchaseRequest> findByFiltersWithQueryDSL(
            ProductCategory category,
            RequestStatus status,
            String searchType,
            String keyword) {

        QPurchaseRequest request = QPurchaseRequest.purchaseRequest;
        QFixedSale fixedSale = QFixedSale.fixedSale;
        QProduct product = QProduct.product;
        QUser buyer = QUser.user;
        QUser seller = new QUser("seller");

        return queryFactory
                .selectFrom(request)
                .leftJoin(request.fixedSale, fixedSale).fetchJoin()
                .leftJoin(fixedSale.product, product).fetchJoin()
                .leftJoin(request.user, buyer).fetchJoin()
                .leftJoin(fixedSale.user, seller).fetchJoin()
                .where(
                        categoryEq(category),
                        statusEq(status),
                        searchKeyword(searchType, keyword)
                )
                .orderBy(request.createdAt.desc())
                .fetch();
    }

    @Override
    public List<PurchaseRequest> findByUserWithFiltersWithQueryDSL(
            User userEntity,
            ProductCategory category,
            RequestStatus status,
            String searchType,
            String keyword) {

        QPurchaseRequest request = QPurchaseRequest.purchaseRequest;
        QFixedSale fixedSale = QFixedSale.fixedSale;
        QProduct product = QProduct.product;
        QUser seller = new QUser("seller");

        return queryFactory
                .selectFrom(request)
                .leftJoin(request.fixedSale, fixedSale).fetchJoin()
                .leftJoin(fixedSale.product, product).fetchJoin()
                .leftJoin(fixedSale.user, seller).fetchJoin()
                .where(
                        request.user.eq(userEntity),
                        categoryEq(category),
                        statusEq(status),
                        searchKeyword(searchType, keyword)
                )
                .orderBy(request.createdAt.desc())
                .fetch();
    }

    @Override
    public List<PurchaseRequest> findBySellerWithFiltersWithQueryDSL(
            User sellerEntity,
            ProductCategory category,
            RequestStatus status,
            String searchType,
            String keyword) {

        QPurchaseRequest request = QPurchaseRequest.purchaseRequest;
        QFixedSale fixedSale = QFixedSale.fixedSale;
        QProduct product = QProduct.product;
        QUser buyer = QUser.user;

        return queryFactory
                .selectFrom(request)
                .leftJoin(request.fixedSale, fixedSale).fetchJoin()
                .leftJoin(fixedSale.product, product).fetchJoin()
                .leftJoin(request.user, buyer).fetchJoin()
                .where(
                        fixedSale.user.eq(sellerEntity),
                        categoryEq(category),
                        statusEq(status),
                        searchKeyword(searchType, keyword)
                )
                .orderBy(request.createdAt.desc())
                .fetch();
    }

    private BooleanExpression categoryEq(ProductCategory category) {
        return category != null ? QProduct.product.category.eq(category) : null;
    }

    private BooleanExpression statusEq(RequestStatus status) {
        return status != null ? QPurchaseRequest.purchaseRequest.requestStatus.eq(status) : null;
    }

    private BooleanExpression searchKeyword(String searchType, String keyword) {
        if (keyword == null || keyword.isEmpty()) return null;

        QPurchaseRequest request = QPurchaseRequest.purchaseRequest;
        QProduct product = QProduct.product;
        QUser buyer = QUser.user;

        if ("productName".equals(searchType)) {
            return product.productName.containsIgnoreCase(keyword);
        } else if ("buyer".equals(searchType)) {
            return buyer.username.containsIgnoreCase(keyword)
                    .or(buyer.nickname.containsIgnoreCase(keyword));
        } else {
            return product.productName.containsIgnoreCase(keyword)
                    .or(buyer.username.containsIgnoreCase(keyword))
                    .or(buyer.nickname.containsIgnoreCase(keyword));
        }
    }
}
