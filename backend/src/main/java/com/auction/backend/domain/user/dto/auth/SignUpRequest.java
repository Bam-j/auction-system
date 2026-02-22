package com.auction.backend.domain.user.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {

    @NotBlank(message = "아이디는 필수 입력값입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9]{7,}$",
            message = "아이디는 7자 이상, 영문 대소문자와 숫자만 사용 가능합니다.")
    private String username;

    @NotBlank(message = "닉네임은 필수 입력값입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$",
            message = "닉네임은 영문, 숫자, 언더바(_)만 사용 가능합니다.")
    private String nickname;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&\\-_#.+^=])[A-Za-z\\d@$!%*?&\\-_#.+^=]{8,}$",
            message = "비밀번호는 8자 이상, 대/소문자/숫자/특수문자를 모두 포함해야 합니다.")
    private String password;
}
