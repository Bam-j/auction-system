package com.auction.backend.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateNicknameRequest {

    @NotBlank(message = "닉네임을 입력해주세요.")
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,16}$", message = "3~16자의 영문, 숫자, 언더바(_)만 사용 가능합니다.")
    private String newNickname;
}