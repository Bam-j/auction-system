package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.dto.auth.SignUpRequest;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserRole;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.jwt.JwtTokenProvider;
import com.auction.backend.global.utils.TextFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthCommandService {

    private final UserRepository userRepository;
    private final AuthQueryService authQueryService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TextFilter textFilter;

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
}
