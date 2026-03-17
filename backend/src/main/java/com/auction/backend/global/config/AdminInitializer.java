package com.auction.backend.global.config;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserRole;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.nickname}")
    private String adminNickname;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername(adminUsername)) {
            log.info("초기 어드민 계정 생성을 시작합니다...");

            User admin = User.builder()
                    .username(adminUsername)
                    .nickname(adminNickname)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(UserRole.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);
            log.info("어드민 계정 생성 완료 (ID: {}, Nickname: {})", adminUsername, adminNickname);
        } else {
            log.info("이미 어드민 계정({})이 존재합니다.", adminUsername);
        }
    }
}
