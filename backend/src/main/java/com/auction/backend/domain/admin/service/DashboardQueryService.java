package com.auction.backend.domain.admin.service;

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
}
