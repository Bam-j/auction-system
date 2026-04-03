package com.auction.backend.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class FixedSaleStatsResponse {
    private long todayRegisteredFixedSales;
    private long todaySoldFixedSalesCount;
    private long todaySentPurchaseRequests;
    private long todayAcceptedPurchaseRequests;
    private long todayCancelledPurchaseRequests;
    private List<DailyFixedSaleStats> dailyStats;

    @Getter
    @Builder
    public static class DailyFixedSaleStats {
        private String date;
        private long registeredFixedSales;
        private long soldFixedSalesCount;
        private long sentPurchaseRequests;
        private long acceptedPurchaseRequests;
        private long cancelledPurchaseRequests;
    }
}
