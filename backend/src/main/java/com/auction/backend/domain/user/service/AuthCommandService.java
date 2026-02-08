package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.dto.SignUpRequest;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserRole;
import com.auction.backend.domain.user.exception.DuplicateUserException;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthCommandService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Long save(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new DuplicateUserException("이미 존재하는 아이디입니다.");
        } else if (userRepository.existsByNickname(signUpRequest.getNickname())) {
            throw new DuplicateUserException("이미 존재하는 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        User user = User.createUser(
                signUpRequest.getUsername(),
                signUpRequest.getNickname(),
                encodedPassword,
                UserRole.USER
        );

        return userRepository.save(user).getUserId();
    }
}
