package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.admin.dto.AuctionStatsResponse;
import com.auction.backend.domain.admin.dto.FixedSaleStatsResponse;
import com.auction.backend.domain.admin.dto.ProductStatsResponse;
import com.auction.backend.domain.admin.dto.UserStatsResponse;
import com.auction.backend.domain.admin.repository.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardQueryService {

    private final DashboardRepository dashboardRepository;

    public UserStatsResponse getUserStats(int days) {
        return dashboardRepository.getUserStats(days);
    }

    public ProductStatsResponse getProductStats(int days) {
        return dashboardRepository.getProductStats(days);
    }

    public AuctionStatsResponse getAuctionStats(int days) {
        return dashboardRepository.getAuctionStats(days);
    }

    public FixedSaleStatsResponse getFixedSaleStats(int days) {
        return dashboardRepository.getFixedSaleStats(days);
    }
}
