package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerificationCommandService {

    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final String REDIS_PREFIX = "EMAIL_VERIFICATION:";
    private static final long VERIFICATION_EXPIRATION_MINUTES = 5;

    public void sendVerificationEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String verificationCode = generateVerificationCode();

        // Redis에 인증 코드 저장 (유효 기간 5분)
        redisTemplate.opsForValue().set(
                REDIS_PREFIX + email,
                verificationCode,
                Duration.ofMinutes(VERIFICATION_EXPIRATION_MINUTES)
        );

        // 이메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("[AbyssBlock] 이메일 인증 코드 안내");
        message.setText("안녕하세요. AbyssBlock입니다.\n\n" +
                "이메일 인증을 위한 코드는 다음과 같습니다:\n" +
                verificationCode + "\n\n" +
                "해당 코드는 5분간 유효합니다.");

        mailSender.send(message);
        log.info("Sent verification email to {}: {}", email, verificationCode);
    }

    public boolean verifyCode(String email, String code) {
        String storedCode = redisTemplate.opsForValue().get(REDIS_PREFIX + email);
        
        if (storedCode == null || !storedCode.equals(code)) {
            return false;
        }

        // 인증 성공 시 Redis에서 해당 코드 삭제 (중복 사용 방지)
        redisTemplate.delete(REDIS_PREFIX + email);
        return true;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
