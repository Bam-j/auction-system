package com.auction.backend.domain.notification.service;

import com.auction.backend.domain.notification.entity.Notification;
import com.auction.backend.domain.notification.entity.NotificationType;
import com.auction.backend.domain.notification.repository.NotificationRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationCommandService 단위 테스트")
class NotificationCommandServiceTest {

    @InjectMocks
    private NotificationCommandService notificationCommandService;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private NotificationQueryService notificationQueryService;

    @Test
    @DisplayName("알림 전송 성공 (SSE Emitter 없음)")
    void send_Success_NoEmitter() {
        // given
        User receiver = User.builder().build();
        ReflectionTestUtils.setField(receiver, "userId", 1L);
        NotificationType type = NotificationType.BID_WON;
        String message = "Congratulations!";
        Long targetId = 1L;

        given(notificationQueryService.getEmitter(anyLong())).willReturn(null);

        // when
        notificationCommandService.send(receiver, type, message, targetId);

        // then
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    @DisplayName("알림 전송 및 SSE 전송 성공")
    void send_Success_WithEmitter() throws IOException {
        // given
        User receiver = User.builder().build();
        ReflectionTestUtils.setField(receiver, "userId", 1L);
        SseEmitter emitter = mock(SseEmitter.class);
        given(notificationQueryService.getEmitter(anyLong())).willReturn(emitter);

        // when
        notificationCommandService.send(receiver, NotificationType.OUTBID, "Outbid!", 1L);

        // then
        verify(notificationRepository).save(any(Notification.class));
        verify(emitter).send(any(SseEmitter.SseEventBuilder.class));
    }

    @Test
    @DisplayName("알림 읽음 처리 성공")
    void markAsRead_Success() {
        // given
        Long notificationId = 1L;
        Notification notification = Notification.builder().type(NotificationType.BID_WON).build();
        given(notificationQueryService.getNotification(notificationId)).willReturn(notification);

        // when
        notificationCommandService.markAsRead(notificationId);

        // then
        assertThat(notification.isRead()).isTrue();
    }

    @Test
    @DisplayName("모든 알림 읽음 처리 성공")
    void markAllAsRead_Success() {
        // given
        Long userId = 1L;
        User user = User.builder().build();
        Notification n1 = Notification.builder().type(NotificationType.BID_WON).build();
        Notification n2 = Notification.builder().type(NotificationType.BID_WON).build();
        
        given(userQueryService.getUser(userId)).willReturn(user);
        given(notificationQueryService.getNotificationsByUser(user)).willReturn(List.of(n1, n2));

        // when
        notificationCommandService.markAllAsRead(userId);

        // then
        assertThat(n1.isRead()).isTrue();
        assertThat(n2.isRead()).isTrue();
    }
}
