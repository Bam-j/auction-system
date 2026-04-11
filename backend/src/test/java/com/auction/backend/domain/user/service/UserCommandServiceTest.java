package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.exception.DuplicateUserException;
import com.auction.backend.domain.user.exception.SamePasswordException;
import com.auction.backend.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserCommandService 단위 테스트")
class UserCommandServiceTest {

    @InjectMocks
    private UserCommandService userCommandService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("닉네임 변경 성공")
    void updateNickname_Success() {
        // given
        Long userId = 1L;
        String newNickname = "newName";
        User user = User.builder().nickname("oldName").build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(userRepository.existsByNickname(newNickname)).willReturn(false);

        // when
        userCommandService.updateNickname(userId, newNickname);

        // then
        assertThat(user.getNickname()).isEqualTo(newNickname);
        verify(userRepository).existsByNickname(newNickname);
    }

    @Test
    @DisplayName("이미 존재하는 닉네임으로 변경 시 예외 발생")
    void updateNickname_Fail_Duplicate() {
        // given
        Long userId = 1L;
        String newNickname = "duplicateName";
        User user = User.builder().nickname("oldName").build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(userRepository.existsByNickname(newNickname)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> userCommandService.updateNickname(userId, newNickname))
                .isInstanceOf(DuplicateUserException.class)
                .hasMessageContaining("이미 사용 중인 닉네임입니다.");
    }

    @Test
    @DisplayName("비밀번호 변경 성공")
    void updatePassword_Success() {
        // given
        Long userId = 1L;
        String currentPassword = "oldPassword";
        String newPassword = "newPassword";
        String encodedNewPassword = "encodedNewPassword";
        User user = User.builder().password(currentPassword).build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(passwordEncoder.matches(newPassword, currentPassword)).willReturn(false);
        given(passwordEncoder.encode(newPassword)).willReturn(encodedNewPassword);

        // when
        userCommandService.updatePassword(userId, newPassword);

        // then
        assertThat(user.getPassword()).isEqualTo(encodedNewPassword);
        verify(passwordEncoder).encode(newPassword);
    }

    @Test
    @DisplayName("기존과 동일한 비밀번호로 변경 시 예외 발생")
    void updatePassword_Fail_SamePassword() {
        // given
        Long userId = 1L;
        String currentPassword = "password123";
        User user = User.builder().password(currentPassword).build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(passwordEncoder.matches(currentPassword, currentPassword)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> userCommandService.updatePassword(userId, currentPassword))
                .isInstanceOf(SamePasswordException.class)
                .hasMessageContaining("기존과 동일한 비밀번호로는 변경할 수 없습니다.");
    }

    @Test
    @DisplayName("회원 탈퇴 성공")
    void deleteAccount_Success() {
        // given
        Long userId = 1L;
        String rawPassword = "password123";
        User user = User.builder()
                .password("encodedPassword")
                .status(UserStatus.ACTIVE)
                .build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(passwordEncoder.matches(rawPassword, "encodedPassword")).willReturn(true);

        // when
        userCommandService.deleteAccount(userId, rawPassword);

        // then
        assertThat(user.getStatus()).isEqualTo(UserStatus.DELETED);
    }

    @Test
    @DisplayName("회원 탈퇴 시 비밀번호 불일치 예외 발생")
    void deleteAccount_Fail_BadCredentials() {
        // given
        Long userId = 1L;
        String wrongPassword = "wrongPassword";
        User user = User.builder()
                .password("encodedPassword")
                .status(UserStatus.ACTIVE)
                .build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(passwordEncoder.matches(wrongPassword, "encodedPassword")).willReturn(false);

        // when & then
        assertThatThrownBy(() -> userCommandService.deleteAccount(userId, wrongPassword))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("비밀번호가 일치하지 않습니다.");
    }
}
