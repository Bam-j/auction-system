package com.auction.backend.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DeleteAccountRequest {

    @NotBlank(message = "본인 확인을 위해 비밀번호를 입력해주세요.")
    private String password;
}