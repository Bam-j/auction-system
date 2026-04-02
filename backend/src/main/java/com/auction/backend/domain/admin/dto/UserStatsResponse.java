package com.auction.backend.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class UserStatsResponse {
    private long todayNewUsers;
    private long todayBlockedUsers;
    private long todayWithdrawnUsers;
    private List<DailyUserStats> dailyStats;

    @Getter
    @Builder
    public static class DailyUserStats {
        private String date;
        private long newUsers;
        private long blockedUsers;
        private long withdrawnUsers;
    }
}
