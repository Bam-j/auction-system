package com.auction.backend.domain.notification.service;

import com.auction.backend.domain.notification.dto.NotificationResponse;
import com.auction.backend.domain.notification.entity.Notification;
import com.auction.backend.domain.notification.entity.NotificationType;
import com.auction.backend.domain.notification.repository.NotificationRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.exception.common.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationQueryService 단위 테스트")
class NotificationQueryServiceTest {

    @InjectMocks
    private NotificationQueryService notificationQueryService;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private NotificationRepository notificationRepository;

    @Test
    @DisplayName("알림 조회 성공")
    void getNotification_Success() {
        // given
        Long notificationId = 1L;
        Notification notification = Notification.builder().type(NotificationType.BID_WON).build();
        given(notificationRepository.findById(notificationId)).willReturn(Optional.of(notification));

        // when
        Notification result = notificationQueryService.getNotification(notificationId);

        // then
        assertThat(result).isEqualTo(notification);
    }

    @Test
    @DisplayName("존재하지 않는 알림 조회 시 예외 발생")
    void getNotification_Fail_NotFound() {
        // given
        Long notificationId = 999L;
        given(notificationRepository.findById(notificationId)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> notificationQueryService.getNotification(notificationId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("해당 알림을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("구독 및 Emitter 관리 성공")
    void subscribe_Success() {
        // given
        Long userId = 1L;

        // when
        SseEmitter emitter = notificationQueryService.subscribe(userId);

        // then
        assertThat(emitter).isNotNull();
        assertThat(notificationQueryService.getEmitter(userId)).isEqualTo(emitter);
        
        // cleanup
        notificationQueryService.removeEmitter(userId);
        assertThat(notificationQueryService.getEmitter(userId)).isNull();
    }

    @Test
    @DisplayName("사용자별 알림 목록 조회 성공")
    void getNotifications_Success() {
        // given
        Long userId = 1L;
        User user = User.builder().build();
        Notification n = Notification.builder().message("Test").build();
        
        given(userQueryService.getUser(userId)).willReturn(user);
        given(notificationRepository.findByReceiverOrderByCreatedAtDesc(user)).willReturn(List.of(n));

        // when
        List<NotificationResponse> result = notificationQueryService.getNotifications(userId);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMessage()).isEqualTo("Test");
    }
}
