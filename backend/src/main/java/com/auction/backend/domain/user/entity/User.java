package com.auction.backend.domain.user.entity;

import com.auction.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 100, unique = true)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100, unique = true)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @Builder
    public User(String username, String password, String nickname, UserRole role, UserStatus status) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.role = role != null ? role : UserRole.USER;
        this.status = status != null ? status : UserStatus.ACTIVE;
    }

    public static User createUser(String username, String nickname, String encodedPassword, UserRole role) {
        return User.builder()
                .username(username)
                .nickname(nickname)
                .password(encodedPassword)
                .role(role)
                .status(UserStatus.ACTIVE)
                .build();
    }

    public void updateNickname(String newNickname) {
        this.nickname = newNickname;
    }

    public void updatePassword(String encodedNewPassword) {
        this.password = encodedNewPassword;
    }

    public void markAsDeleted() {
        this.status = UserStatus.DELETED;

        //탈퇴 유저의 닉네임 및 비밀번호 파기
        this.nickname = "(탈퇴한 사용자)";
        this.password = "DELETED_USER_PASSWORD_SCRAMBLED";
    }
}
