package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.dto.auth.LoginRequest;
import com.auction.backend.domain.user.dto.auth.LoginResponse;
import com.auction.backend.domain.user.dto.auth.SignUpRequest;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserRole;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.exception.DuplicateUserException;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthCommandService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public void checkUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUserException("이미 존재하는 아이디입니다.");
        }
    }

    @Transactional(readOnly = true)
    public void checkNickname(String nickname) {
        if (userRepository.existsByNickname(nickname)) {
            throw new DuplicateUserException("이미 존재하는 닉네임입니다.");
        }
    }

    public void save(SignUpRequest signUpRequest) {
        checkUsername(signUpRequest.getUsername());
        checkNickname(signUpRequest.getNickname());

        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        User user = User.createUser(
                signUpRequest.getUsername(),
                signUpRequest.getNickname(),
                encodedPassword,
                UserRole.USER
        );

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        if (user.getStatus() == UserStatus.DELETED) {
            throw new DisabledException("탈퇴한 계정입니다.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.createToken(user.getUserId(), user.getRole().name());

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(UserResponse.from(user))
                .build();
    }
}
