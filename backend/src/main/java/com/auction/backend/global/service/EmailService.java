package com.auction.backend.global.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String code) {
        log.info("Sending verification email to: {}, code: {}", to, code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[AbyssBlock] 회원가입 이메일 인증 번호");
        message.setText("안녕하세요! AbyssBlock 경매 시스템입니다.\n\n"
                + "이메일 인증을 위해 아래의 6자리 번호를 입력해주세요.\n\n"
                + "인증 번호: [" + code + "]\n\n"
                + "본 번호는 5분 동안 유효합니다.\n"
                + "감사합니다.");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
