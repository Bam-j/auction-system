package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.dto.auth.SignUpRequest;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserRole;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.domain.user.dto.auth.LoginRequest;
import com.auction.backend.domain.user.dto.auth.LoginResponse;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.global.jwt.JwtTokenProvider;
import com.auction.backend.global.utils.TextFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthCommandService {

    private final UserRepository userRepository;
    private final AuthQueryService authQueryService;
    private final PasswordEncoder passwordEncoder;
    private final TextFilter textFilter;
    private final StringRedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserQueryService userQueryService;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshTokenExpiration;

    private static final String REFRESH_TOKEN_PREFIX = "RT:";

    //회원 가입
    public void save(SignUpRequest signUpRequest) {
        authQueryService.checkUsername(signUpRequest.getUsername());
        authQueryService.checkNickname(signUpRequest.getNickname());
        textFilter.validateUsernameOrNickname(signUpRequest.getUsername());
        textFilter.validateUsernameOrNickname(signUpRequest.getNickname());

        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        User user = User.createUser(
                signUpRequest.getUsername(),
                signUpRequest.getNickname(),
                encodedPassword,
                UserRole.USER
        );

        userRepository.save(user);
    }

    //로그인
    public LoginResponse login(LoginRequest request) {
        User user = userQueryService.getUserByUsername(request.getUsername())
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

        return issueTokens(user);
    }

    //토큰 갱신
    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("유효하지 않은 Refresh Token입니다.");
        }

        Long userId = jwtTokenProvider.getUserId(refreshToken);

        String storedToken = redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + userId);
        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new BadCredentialsException("만료되었거나 유효하지 않은 Refresh Token입니다.");
        }
        User user = userQueryService.getUser(userId);

        return issueTokens(user);
    }

    //로그아웃
    public void logout(Long userId) {
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + userId);
    }

    private LoginResponse issueTokens(User user) {
        String accessToken = jwtTokenProvider.createAccessToken(user.getUserId(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        redisTemplate.opsForValue().set(
                REFRESH_TOKEN_PREFIX + user.getUserId(),
                refreshToken,
                refreshTokenExpiration,
                TimeUnit.MILLISECONDS
        );

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(UserResponse.from(user))
                .build();
    }
}
