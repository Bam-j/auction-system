package com.auction.backend.domain.notification.service;

import com.auction.backend.domain.notification.dto.NotificationResponse;
import com.auction.backend.domain.notification.entity.Notification;
import com.auction.backend.domain.notification.entity.NotificationType;
import com.auction.backend.domain.notification.repository.NotificationRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.exception.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationCommandService {

    private final NotificationRepository notificationRepository;
    private final UserQueryService userQueryService;
    private final NotificationQueryService notificationQueryService;

    //알림 생성 및 전송
    @Async
    public void send(User receiver, NotificationType type, String message, Long targetId) {
        log.info("Creating notification for user: {}, type: {}, message: {}", receiver.getUserId(), type, message);

        Notification notification = Notification.builder()
                .receiver(receiver)
                .type(type)
                .message(message)
                .targetId(targetId)
                .build();

        notificationRepository.save(notification);

        Long userId = receiver.getUserId();
        SseEmitter emitter = notificationQueryService.getEmitter(userId);

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(NotificationResponse.from(notification)));
                log.info("Sent real-time notification to user: {}", userId);
            } catch (Exception e) {
                log.error("Failed to send SSE notification to user: {}. Removing emitter.", userId, e);
                notificationQueryService.removeEmitter(userId);
            }
        } else {
            log.info("No active emitter for user: {}. Notification saved to DB only.", userId);
        }
    }

    //알림 개별 읽음 처리
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 알림을 찾을 수 없습니다."));
        notification.markAsRead();
    }

    //알림 모두 읽음 처리
    public void markAllAsRead(Long userId) {
        User user = userQueryService.getUser(userId);
        List<Notification> notifications = notificationRepository.findByReceiverOrderByCreatedAtDesc(user);
        notifications.forEach(Notification::markAsRead);
    }
}
