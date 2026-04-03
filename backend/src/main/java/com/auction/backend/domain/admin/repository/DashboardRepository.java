package com.auction.backend.domain.admin.repository;

import static com.auction.backend.domain.product.entity.QProduct.product;
import static com.auction.backend.domain.sale.auction.entity.QAuction.auction;
import static com.auction.backend.domain.sale.auction.entity.QInstantBuyRequest.instantBuyRequest;
import static com.auction.backend.domain.sale.fixedsale.entity.QFixedSale.fixedSale;
import static com.auction.backend.domain.sale.fixedsale.entity.QPurchaseRequest.purchaseRequest;
import static com.auction.backend.domain.bid.entity.QBid.bid;
import static com.auction.backend.domain.user.entity.QUser.user;

import com.auction.backend.domain.admin.dto.AuctionStatsResponse;
import com.auction.backend.domain.admin.dto.FixedSaleStatsResponse;
import com.auction.backend.domain.admin.dto.ProductStatsResponse;
import com.auction.backend.domain.admin.dto.UserStatsResponse;
import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.global.enums.RequestStatus;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DashboardRepository {

    private final JPAQueryFactory queryFactory;

    public UserStatsResponse getUserStats(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.with(LocalTime.MIN);
        LocalDateTime startDate = now.minusDays(days - 1).with(LocalTime.MIN);

        long todayNew = queryFactory
                .select(user.count())
                .from(user)
                .where(user.createdAt.goe(startOfToday))
                .fetchOne();

        long todayBlocked = queryFactory
                .select(user.count())
                .from(user)
                .where(user.status.eq(UserStatus.BLOCKED)
                        .and(user.updatedAt.goe(startOfToday)))
                .fetchOne();

        long todayWithdrawn = queryFactory
                .select(user.count())
                .from(user)
                .where(user.status.eq(UserStatus.DELETED)
                        .and(user.updatedAt.goe(startOfToday)))
                .fetchOne();

        StringTemplate formattedDate = Expressions.stringTemplate(
                "DATE_FORMAT({0}, {1})", user.createdAt, "%Y-%m-%d"
        );
        StringTemplate updatedDate = Expressions.stringTemplate(
                "DATE_FORMAT({0}, {1})", user.updatedAt, "%Y-%m-%d"
        );

        Map<String, Long> newUsersMap = queryFactory
                .select(formattedDate, user.count())
                .from(user)
                .where(user.createdAt.goe(startDate))
                .groupBy(formattedDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(t -> t.get(formattedDate), t -> t.get(user.count())));

        Map<String, Long> blockedUsersMap = queryFactory
                .select(updatedDate, user.count())
                .from(user)
                .where(user.status.eq(UserStatus.BLOCKED).and(user.updatedAt.goe(startDate)))
                .groupBy(updatedDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(t -> t.get(updatedDate), t -> t.get(user.count())));

        Map<String, Long> withdrawnUsersMap = queryFactory
                .select(updatedDate, user.count())
                .from(user)
                .where(user.status.eq(UserStatus.DELETED).and(user.updatedAt.goe(startDate)))
                .groupBy(updatedDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(t -> t.get(updatedDate), t -> t.get(user.count())));

        List<UserStatsResponse.DailyUserStats> dailyStats = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            String date = LocalDate.now().minusDays(i).toString();
            dailyStats.add(UserStatsResponse.DailyUserStats.builder()
                    .date(date)
                    .newUsers(newUsersMap.getOrDefault(date, 0L))
                    .blockedUsers(blockedUsersMap.getOrDefault(date, 0L))
                    .withdrawnUsers(withdrawnUsersMap.getOrDefault(date, 0L))
                    .build());
        }

        dailyStats.sort(Comparator.comparing(UserStatsResponse.DailyUserStats::getDate));

        return UserStatsResponse.builder()
                .todayNewUsers(todayNew)
                .todayBlockedUsers(todayBlocked)
                .todayWithdrawnUsers(todayWithdrawn)
                .dailyStats(dailyStats)
                .build();
    }

    public ProductStatsResponse getProductStats(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.with(LocalTime.MIN);
        LocalDateTime startDate = now.minusDays(days - 1).with(LocalTime.MIN);

        long todayRegistered = queryFactory
                .select(product.count())
                .from(product)
                .where(product.createdAt.goe(startOfToday))
                .fetchOne();

        long todaySold = queryFactory
                .select(product.count())
                .from(product)
                .where(product.salesStatus.in(SalesStatus.SOLD_OUT, SalesStatus.INSTANT_BUY)
                        .and(product.updatedAt.goe(startOfToday)))
                .fetchOne();

        long todayCancelled = queryFactory
                .select(product.count())
                .from(product)
                .where(product.salesStatus.eq(SalesStatus.CANCELLED)
                        .and(product.updatedAt.goe(startOfToday)))
                .fetchOne();

        StringTemplate createdDate = Expressions.stringTemplate(
                "DATE_FORMAT({0}, {1})", product.createdAt, "%Y-%m-%d"
        );
        StringTemplate updatedDate = Expressions.stringTemplate(
                "DATE_FORMAT({0}, {1})", product.updatedAt, "%Y-%m-%d"
        );

        Map<String, Long> registeredMap = queryFactory
                .select(createdDate, product.count())
                .from(product)
                .where(product.createdAt.goe(startDate))
                .groupBy(createdDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(t -> t.get(createdDate), t -> t.get(product.count())));

        Map<String, Long> soldMap = queryFactory
                .select(updatedDate, product.count())
                .from(product)
                .where(product.salesStatus.in(SalesStatus.SOLD_OUT, SalesStatus.INSTANT_BUY)
                        .and(product.updatedAt.goe(startDate)))
                .groupBy(updatedDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(t -> t.get(updatedDate), t -> t.get(product.count())));

        Map<String, Long> cancelledMap = queryFactory
                .select(updatedDate, product.count())
                .from(product)
                .where(product.salesStatus.eq(SalesStatus.CANCELLED)
                        .and(product.updatedAt.goe(startDate)))
                .groupBy(updatedDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(t -> t.get(updatedDate), t -> t.get(product.count())));

        List<ProductStatsResponse.DailyProductStats> dailyStats = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            String date = LocalDate.now().minusDays(i).toString();
            dailyStats.add(ProductStatsResponse.DailyProductStats.builder()
                    .date(date)
                    .registered(registeredMap.getOrDefault(date, 0L))
                    .sold(soldMap.getOrDefault(date, 0L))
                    .cancelled(cancelledMap.getOrDefault(date, 0L))
                    .build());
        }

        dailyStats.sort(Comparator.comparing(ProductStatsResponse.DailyProductStats::getDate));

        return ProductStatsResponse.builder()
                .todayRegistered(todayRegistered)
                .todaySold(todaySold)
                .todayCancelled(todayCancelled)
                .dailyStats(dailyStats)
                .build();
    }

    public AuctionStatsResponse getAuctionStats(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.with(LocalTime.MIN);
        LocalDateTime startDate = now.minusDays(days - 1).with(LocalTime.MIN);

        long todayRegisteredAuctions = queryFactory.select(auction.count()).from(auction).where(auction.createdAt.goe(startOfToday)).fetchOne();
        long todayRegisteredBids = queryFactory.select(bid.count()).from(bid).where(bid.createdAt.goe(startOfToday)).fetchOne();
        long todayClosedAuctions = queryFactory.select(auction.count()).from(auction).where(auction.endedAt.between(startOfToday, now)).fetchOne();
        long todayWonAuctions = queryFactory.select(bid.count()).from(bid).where(bid.bidStatus.eq(BidStatus.SUCCESS).and(bid.updatedAt.goe(startOfToday))).fetchOne();
        long todayInstantBoughtAuctions = queryFactory.select(instantBuyRequest.count()).from(instantBuyRequest).where(instantBuyRequest.requestStatus.eq(RequestStatus.APPROVED).and(instantBuyRequest.createdAt.goe(startOfToday))).fetchOne();
        long todaySentInstantBuyRequests = queryFactory.select(instantBuyRequest.count()).from(instantBuyRequest).where(instantBuyRequest.createdAt.goe(startOfToday)).fetchOne();
        long todayRejectedInstantBuyRequests = queryFactory.select(instantBuyRequest.count()).from(instantBuyRequest).where(instantBuyRequest.requestStatus.eq(RequestStatus.REJECTED).and(instantBuyRequest.createdAt.goe(startOfToday))).fetchOne();

        long todayFailedAuctions = queryFactory
                .select(auction.count())
                .from(auction)
                .where(auction.endedAt.between(startOfToday, now)
                        .and(JPAExpressions.selectOne().from(bid).where(bid.auction.eq(auction)).notExists())
                        .and(JPAExpressions.selectOne().from(instantBuyRequest).where(instantBuyRequest.auction.eq(auction).and(instantBuyRequest.requestStatus.eq(RequestStatus.APPROVED))).notExists()))
                .fetchOne();

        StringTemplate auctionCreatedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", auction.createdAt, "%Y-%m-%d");
        StringTemplate auctionEndedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", auction.endedAt, "%Y-%m-%d");
        StringTemplate bidCreatedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", bid.createdAt, "%Y-%m-%d");
        StringTemplate bidUpdatedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", bid.updatedAt, "%Y-%m-%d");
        StringTemplate instantRequestCreatedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", instantBuyRequest.createdAt, "%Y-%m-%d");

        Map<String, Long> registeredAuctionsMap = queryFactory.select(auctionCreatedDate, auction.count()).from(auction).where(auction.createdAt.goe(startDate)).groupBy(auctionCreatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(auctionCreatedDate), t -> t.get(auction.count())));
        Map<String, Long> registeredBidsMap = queryFactory.select(bidCreatedDate, bid.count()).from(bid).where(bid.createdAt.goe(startDate)).groupBy(bidCreatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(bidCreatedDate), t -> t.get(bid.count())));
        Map<String, Long> closedAuctionsMap = queryFactory.select(auctionEndedDate, auction.count()).from(auction).where(auction.endedAt.between(startDate, now)).groupBy(auctionEndedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(auctionEndedDate), t -> t.get(auction.count())));
        Map<String, Long> wonAuctionsMap = queryFactory.select(bidUpdatedDate, bid.count()).from(bid).where(bid.bidStatus.eq(BidStatus.SUCCESS).and(bid.updatedAt.goe(startDate))).groupBy(bidUpdatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(bidUpdatedDate), t -> t.get(bid.count())));
        Map<String, Long> instantBoughtMap = queryFactory.select(instantRequestCreatedDate, instantBuyRequest.count()).from(instantBuyRequest).where(instantBuyRequest.requestStatus.eq(RequestStatus.APPROVED).and(instantBuyRequest.createdAt.goe(startDate))).groupBy(instantRequestCreatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(instantRequestCreatedDate), t -> t.get(instantBuyRequest.count())));
        Map<String, Long> sentInstantRequestsMap = queryFactory.select(instantRequestCreatedDate, instantBuyRequest.count()).from(instantBuyRequest).where(instantBuyRequest.createdAt.goe(startDate)).groupBy(instantRequestCreatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(instantRequestCreatedDate), t -> t.get(instantBuyRequest.count())));
        Map<String, Long> rejectedInstantRequestsMap = queryFactory.select(instantRequestCreatedDate, instantBuyRequest.count()).from(instantBuyRequest).where(instantBuyRequest.requestStatus.eq(RequestStatus.REJECTED).and(instantBuyRequest.createdAt.goe(startDate))).groupBy(instantRequestCreatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(instantRequestCreatedDate), t -> t.get(instantBuyRequest.count())));

        Map<String, Long> failedAuctionsMap = queryFactory
                .select(auctionEndedDate, auction.count())
                .from(auction)
                .where(auction.endedAt.between(startDate, now)
                        .and(JPAExpressions.selectOne().from(bid).where(bid.auction.eq(auction)).notExists())
                        .and(JPAExpressions.selectOne().from(instantBuyRequest).where(instantBuyRequest.auction.eq(auction).and(instantBuyRequest.requestStatus.eq(RequestStatus.APPROVED))).notExists()))
                .groupBy(auctionEndedDate)
                .fetch().stream().collect(Collectors.toMap(t -> t.get(auctionEndedDate), t -> t.get(auction.count())));

        List<AuctionStatsResponse.DailyAuctionStats> dailyStats = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            String date = LocalDate.now().minusDays(i).toString();
            dailyStats.add(AuctionStatsResponse.DailyAuctionStats.builder()
                    .date(date)
                    .registeredAuctions(registeredAuctionsMap.getOrDefault(date, 0L))
                    .registeredBids(registeredBidsMap.getOrDefault(date, 0L))
                    .closedAuctions(closedAuctionsMap.getOrDefault(date, 0L))
                    .wonAuctions(wonAuctionsMap.getOrDefault(date, 0L))
                    .failedAuctions(failedAuctionsMap.getOrDefault(date, 0L))
                    .instantBoughtAuctions(instantBoughtMap.getOrDefault(date, 0L))
                    .sentInstantBuyRequests(sentInstantRequestsMap.getOrDefault(date, 0L))
                    .rejectedInstantBuyRequests(rejectedInstantRequestsMap.getOrDefault(date, 0L))
                    .build());
        }

        dailyStats.sort(Comparator.comparing(AuctionStatsResponse.DailyAuctionStats::getDate));

        return AuctionStatsResponse.builder()
                .todayRegisteredAuctions(todayRegisteredAuctions)
                .todayRegisteredBids(todayRegisteredBids)
                .todayClosedAuctions(todayClosedAuctions)
                .todayWonAuctions(todayWonAuctions)
                .todayFailedAuctions(todayFailedAuctions)
                .todayInstantBoughtAuctions(todayInstantBoughtAuctions)
                .todaySentInstantBuyRequests(todaySentInstantBuyRequests)
                .todayRejectedInstantBuyRequests(todayRejectedInstantBuyRequests)
                .dailyStats(dailyStats)
                .build();
    }

    public FixedSaleStatsResponse getFixedSaleStats(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.with(LocalTime.MIN);
        LocalDateTime startDate = now.minusDays(days - 1).with(LocalTime.MIN);

        long todayRegistered = queryFactory.select(fixedSale.count()).from(fixedSale).where(fixedSale.createdAt.goe(startOfToday)).fetchOne();
        long todaySentRequests = queryFactory.select(purchaseRequest.count()).from(purchaseRequest).where(purchaseRequest.createdAt.goe(startOfToday)).fetchOne();
        long todayAcceptedRequests = queryFactory.select(purchaseRequest.count()).from(purchaseRequest).where(purchaseRequest.requestStatus.eq(RequestStatus.APPROVED).and(purchaseRequest.updatedAt.goe(startOfToday))).fetchOne();
        long todayCancelledRequests = queryFactory.select(purchaseRequest.count()).from(purchaseRequest).where(purchaseRequest.requestStatus.eq(RequestStatus.CANCELLED).and(purchaseRequest.updatedAt.goe(startOfToday))).fetchOne();

        NumberTemplate<Integer> quantitySum = Expressions.numberTemplate(Integer.class, "sum({0})", purchaseRequest.quantity);
        Integer todaySoldSum = queryFactory.select(quantitySum).from(purchaseRequest).where(purchaseRequest.requestStatus.eq(RequestStatus.APPROVED).and(purchaseRequest.updatedAt.goe(startOfToday))).fetchOne();
        long todaySoldAmount = todaySoldSum != null ? todaySoldSum.longValue() : 0L;

        StringTemplate saleCreatedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", fixedSale.createdAt, "%Y-%m-%d");
        StringTemplate requestCreatedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", purchaseRequest.createdAt, "%Y-%m-%d");
        StringTemplate requestUpdatedDate = Expressions.stringTemplate("DATE_FORMAT({0}, {1})", purchaseRequest.updatedAt, "%Y-%m-%d");

        Map<String, Long> registeredMap = queryFactory.select(saleCreatedDate, fixedSale.count()).from(fixedSale).where(fixedSale.createdAt.goe(startDate)).groupBy(saleCreatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(saleCreatedDate), t -> t.get(fixedSale.count())));
        Map<String, Long> sentRequestsMap = queryFactory.select(requestCreatedDate, purchaseRequest.count()).from(purchaseRequest).where(purchaseRequest.createdAt.goe(startDate)).groupBy(requestCreatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(requestCreatedDate), t -> t.get(purchaseRequest.count())));
        Map<String, Long> acceptedRequestsMap = queryFactory.select(requestUpdatedDate, purchaseRequest.count()).from(purchaseRequest).where(purchaseRequest.requestStatus.eq(RequestStatus.APPROVED).and(purchaseRequest.updatedAt.goe(startDate))).groupBy(requestUpdatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(requestUpdatedDate), t -> t.get(purchaseRequest.count())));
        Map<String, Long> cancelledRequestsMap = queryFactory.select(requestUpdatedDate, purchaseRequest.count()).from(purchaseRequest).where(purchaseRequest.requestStatus.eq(RequestStatus.CANCELLED).and(purchaseRequest.updatedAt.goe(startDate))).groupBy(requestUpdatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(requestUpdatedDate), t -> t.get(purchaseRequest.count())));

        Map<String, Long> soldAmountMap = queryFactory.select(requestUpdatedDate, quantitySum).from(purchaseRequest).where(purchaseRequest.requestStatus.eq(RequestStatus.APPROVED).and(purchaseRequest.updatedAt.goe(startDate))).groupBy(requestUpdatedDate).fetch().stream().collect(Collectors.toMap(t -> t.get(requestUpdatedDate), t -> {
            Integer sum = t.get(quantitySum);
            return sum != null ? sum.longValue() : 0L;
        }));

        List<FixedSaleStatsResponse.DailyFixedSaleStats> dailyStats = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            String date = LocalDate.now().minusDays(i).toString();
            dailyStats.add(FixedSaleStatsResponse.DailyFixedSaleStats.builder()
                    .date(date)
                    .registeredFixedSales(registeredMap.getOrDefault(date, 0L))
                    .soldFixedSalesCount(soldAmountMap.getOrDefault(date, 0L))
                    .sentPurchaseRequests(sentRequestsMap.getOrDefault(date, 0L))
                    .acceptedPurchaseRequests(acceptedRequestsMap.getOrDefault(date, 0L))
                    .cancelledPurchaseRequests(cancelledRequestsMap.getOrDefault(date, 0L))
                    .build());
        }

        dailyStats.sort(Comparator.comparing(FixedSaleStatsResponse.DailyFixedSaleStats::getDate));

        return FixedSaleStatsResponse.builder()
                .todayRegisteredFixedSales(todayRegistered)
                .todaySoldFixedSalesCount(todaySoldAmount)
                .todaySentPurchaseRequests(todaySentRequests)
                .todayAcceptedPurchaseRequests(todayAcceptedRequests)
                .todayCancelledPurchaseRequests(todayCancelledRequests)
                .dailyStats(dailyStats)
                .build();
    }
}
