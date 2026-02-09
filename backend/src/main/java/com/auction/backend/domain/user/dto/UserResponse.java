package com.auction.backend.domain.user.dto;

import com.auction.backend.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long userId;
    private String nickname;
    private String userRole;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .userRole(user.getRole().name())
                .build();
    }
}
