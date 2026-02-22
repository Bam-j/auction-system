package com.auction.backend.domain.user.dto.profile;

import com.auction.backend.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long username;
    private String nickname;
    private String role;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .username(user.getUserId())
                .nickname(user.getNickname())
                .role(user.getRole().name())
                .build();
    }
}
