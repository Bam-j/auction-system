package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCommandService {

    private final UserQueryService userQueryService;

    //특정 회원 차단
    public void blockUser(Long userId) {
        User user = userQueryService.getUser(userId);
        user.block();
    }

    //특정 회원 차단 해제
    public void unblockUser(Long userId) {
        User user = userQueryService.getUser(userId);
        user.unblock();
    }
}
