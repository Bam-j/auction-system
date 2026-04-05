package com.auction.backend.domain.user.dto.profile;

import com.auction.backend.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String nickname;
    private String role;
    private String status;
    private String email;
    
    @com.fasterxml.jackson.annotation.JsonProperty("isVerified")
    private boolean isVerified;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getUserId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .email(user.getEmail())
                .isVerified(user.isVerified())
                .build();
    }
}
