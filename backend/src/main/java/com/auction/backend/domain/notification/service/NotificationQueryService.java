package com.auction.backend.domain.notification.service;

import com.auction.backend.domain.notification.dto.NotificationResponse;
import com.auction.backend.domain.notification.repository.NotificationRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationQueryService {

    private final UserQueryService userQueryService;
    private final NotificationRepository notificationRepository;

    // 사용자 ID를 키로 하는 SseEmitter 저장소
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    private static final Long DEFAULT_TIMEOUT = 0L;

    //알림 구독을 위한 연결
    public SseEmitter subscribe(Long userId) {
        log.info("SSE subscription attempt for user ID: {}", userId);

        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> {
            log.info("SSE completed for user ID: {}", userId);
            emitters.remove(userId);
        });
        emitter.onTimeout(() -> {
            log.info("SSE timeout for user ID: {}", userId);
            emitters.remove(userId);
        });
        emitter.onError((e) -> {
            log.error("SSE error for user ID: {}", userId, e);
            emitters.remove(userId);
        });

        // 더미 데이터 전송 (연결 확인용)
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
            log.info("Sent connection success event to user ID: {}", userId);
        } catch (IOException e) {
            log.error("Error sending connection event", e);
            emitters.remove(userId);
        }

        return emitter;
    }

    //특정 사용자의 알림 목록 조회
    public List<NotificationResponse> getNotifications(Long userId) {
        User user = userQueryService.getUser(userId);
        return notificationRepository.findByReceiverOrderByCreatedAtDesc(user)
                .stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());
    }

    //연결 조회
    public SseEmitter getEmitter(Long userId) {
        return emitters.get(userId);
    }

    //연결 제거
    public void removeEmitter(Long userId) {
        emitters.remove(userId);
    }
}
