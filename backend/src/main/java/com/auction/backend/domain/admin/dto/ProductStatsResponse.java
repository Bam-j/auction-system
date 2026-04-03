package com.auction.backend.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class ProductStatsResponse {
    private long todayRegistered;
    private long todaySold;
    private long todayCancelled;
    private List<DailyProductStats> dailyStats;

    @Getter
    @Builder
    public static class DailyProductStats {
        private String date;
        private long registered;
        private long sold;
        private long cancelled;
    }
}
