package com.auction.backend.domain.user.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdatePasswordRequest {

    @NotBlank(message = "새 비밀번호를 입력해주세요.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&\\-_#.+^=])[A-Za-z\\d@$!%*?&\\-_#.+^=]{8,}$",
            message = "8자 이상, 대/소문자/숫자/특수문자를 모두 포함해야 합니다.")
    private String newPassword;
}
