package com.auction.backend.domain.admin.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class AuctionStatsResponse {
    private long todayRegisteredAuctions;
    private long todayRegisteredBids;
    private long todayClosedAuctions;
    private long todayWonAuctions;
    private long todayFailedAuctions;
    private long todayInstantBoughtAuctions;
    private long todaySentInstantBuyRequests;
    private long todayRejectedInstantBuyRequests;
    private List<DailyAuctionStats> dailyStats;

    @Getter
    @Builder
    public static class DailyAuctionStats {
        private String date;
        private long registeredAuctions;
        private long registeredBids;
        private long closedAuctions;
        private long wonAuctions;
        private long failedAuctions;
        private long instantBoughtAuctions;
        private long sentInstantBuyRequests;
        private long rejectedInstantBuyRequests;
    }
}
