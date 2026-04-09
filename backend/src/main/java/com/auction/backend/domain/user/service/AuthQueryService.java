package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.exception.DuplicateUserException;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthQueryService {

    private final UserRepository userRepository;

    //아이디(username) 중복 확인
    public void checkUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUserException("이미 존재하는 아이디입니다.");
        }
    }

    //닉네임 중복 확인
    public void checkNickname(String nickname) {
        if (userRepository.existsByNickname(nickname)) {
            throw new DuplicateUserException("이미 존재하는 닉네임입니다.");
        }
    }
}
