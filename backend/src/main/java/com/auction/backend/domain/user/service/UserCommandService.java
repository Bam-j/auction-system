package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserCommandService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    //일반 회원 닉네임 변경
    @Transactional
    public void updateNickname(Long userId, String newNickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (userRepository.existsByNickname(newNickname)) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        user.updateNickname(newNickname);
    }

    //회원 비밀번호 변경
    @Transactional
    public void updatePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.updatePassword(encodedPassword);
    }

    //회원 탈퇴
    //탈퇴 하더라도 글/거래 기록은 남겨야 하므로 Soft Delete로 구현
    @Transactional
    public void deleteAccount(Long userId, String rawPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (user.getStatus() == UserStatus.DELETED) {
            throw new IllegalArgumentException("이미 탈퇴 처리된 사용자입니다.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        user.markAsDeleted();
    }
}
