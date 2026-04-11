package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.service.UserQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminCommandService 단위 테스트")
class AdminCommandServiceTest {

    @InjectMocks
    private AdminCommandService adminCommandService;

    @Mock
    private UserQueryService userQueryService;

    @Test
    @DisplayName("사용자 차단 성공")
    void blockUser_Success() {
        // given
        Long userId = 1L;
        User user = User.builder().status(UserStatus.ACTIVE).build();
        given(userQueryService.getUser(userId)).willReturn(user);

        // when
        adminCommandService.blockUser(userId);

        // then
        assertThat(user.getStatus()).isEqualTo(UserStatus.BLOCKED);
    }

    @Test
    @DisplayName("사용자 차단 해제 성공")
    void unblockUser_Success() {
        // given
        Long userId = 1L;
        User user = User.builder().status(UserStatus.BLOCKED).build();
        given(userQueryService.getUser(userId)).willReturn(user);

        // when
        adminCommandService.unblockUser(userId);

        // then
        assertThat(user.getStatus()).isEqualTo(UserStatus.ACTIVE);
    }
}
