package com.auction.backend.domain.user.dto.email;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "이메일 인증 코드 확인 요청")
public class EmailVerificationCheckRequest {
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    @Schema(description = "인증 확인용 이메일", example = "user@example.com")
    private String email;

    @NotBlank(message = "인증 코드를 입력해주세요.")
    @Schema(description = "받은 인증 코드", example = "123456")
    private String code;
}
