package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCommandService {

    private final UserRepository userRepository;

    //특정 유저 차단
    public void blockUser(Long userId) {
        User user = getUser(userId);
        user.block();
    }

    //특정 유저 차단 해제
    public void unblockUser(Long userId) {
        User user = getUser(userId);
        user.unblock();
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
    }
}
