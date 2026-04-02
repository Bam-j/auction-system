package com.auction.backend.domain.admin.repository;

import static com.auction.backend.domain.user.entity.QUser.user;

import com.auction.backend.domain.admin.dto.UserStatsResponse;
import com.auction.backend.domain.user.entity.UserStatus;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
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
}
