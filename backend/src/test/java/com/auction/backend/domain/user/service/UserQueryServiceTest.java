package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.exception.common.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserQueryService 단위 테스트")
class UserQueryServiceTest {

    @InjectMocks
    private UserQueryService userQueryService;

    @Mock
    private UserRepository userRepository;

    @Nested
    @DisplayName("사용자 조회 테스트")
    class GetUserTest {

        @Test
        @DisplayName("ID로 사용자 조회 성공")
        void getUser_Success() {
            // given
            Long userId = 1L;
            User user = User.builder()
                    .username("testuser")
                    .nickname("테스터")
                    .build();
            given(userRepository.findById(userId)).willReturn(Optional.of(user));

            // when
            User result = userQueryService.getUser(userId);

            // then
            assertThat(result.getUsername()).isEqualTo("testuser");
            assertThat(result.getNickname()).isEqualTo("테스터");
            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("존재하지 않는 ID로 조회 시 예외 발생")
        void getUser_Fail_NotFound() {
            // given
            Long userId = 999L;
            given(userRepository.findById(userId)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> userQueryService.getUser(userId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("사용자를 찾을 수 없습니다.");
        }

        @Test
        @DisplayName("아이디로 사용자 조회")
        void getUserByUsername_Success() {
            // given
            String username = "testuser";
            User user = User.builder().username(username).build();
            given(userRepository.findByUsername(username)).willReturn(Optional.of(user));

            // when
            Optional<User> result = userQueryService.getUserByUsername(username);

            // then
            assertThat(result).isPresent();
            assertThat(result.get().getUsername()).isEqualTo(username);
        }
    }

    @Test
    @DisplayName("전체 회원 목록 조회 테스트")
    void getAllUsers_Success() {
        // given
        User user = User.builder()
                .username("user1")
                .status(UserStatus.ACTIVE)
                .build();
        given(userRepository.findByKeywordAndStatus(any(), any())).willReturn(List.of(user));

        // when
        List<UserResponse> result = userQueryService.getAllUsers("keyword", "ACTIVE");

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsername()).isEqualTo("user1");
        verify(userRepository).findByKeywordAndStatus(anyString(), any(UserStatus.class));
    }
}
