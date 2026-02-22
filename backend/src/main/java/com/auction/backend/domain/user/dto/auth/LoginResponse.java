package com.auction.backend.domain.user.dto.auth;

import com.auction.backend.domain.user.dto.profile.UserResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private UserResponse user;
}
