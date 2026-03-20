package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.dto.auth.LoginRequest;
import com.auction.backend.domain.user.dto.auth.LoginResponse;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.exception.DuplicateUserException;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthQueryService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

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

    //로그인
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("존재하지 않는 아이디입니다."));

        if (user.getStatus() == UserStatus.DELETED) {
            throw new DisabledException("탈퇴한 계정입니다.");
        }

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new LockedException("차단된 계정입니다.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.createToken(user.getUserId(), user.getRole().name());

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(UserResponse.from(user))
                .build();
    }
}