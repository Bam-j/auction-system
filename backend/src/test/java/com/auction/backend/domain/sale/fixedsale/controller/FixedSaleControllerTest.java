package com.auction.backend.domain.sale.fixedsale.controller;

import com.auction.backend.domain.sale.fixedsale.dto.FixedSaleRegisterRequest;
import com.auction.backend.domain.sale.fixedsale.service.FixedSaleService;
import com.auction.backend.global.jwt.JwtTokenProvider;
import com.auction.backend.global.service.FileService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FixedSaleController.class)
class FixedSaleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FixedSaleService fixedSaleService;

    @MockBean
    private FileService fileService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("상품 등록 성공 테스트")
    @WithMockUser(username = "1")
    void registerFixedSaleSuccess() throws Exception {
        // given
        MockMultipartFile image = new MockMultipartFile(
                "image", "test.jpg", "image/jpeg", "test image".getBytes());

        given(fileService.uploadFile(any())).willReturn("/uploads/test.jpg");
        given(fixedSaleService.registerFixedSale(anyLong(), any(), anyString())).willReturn(1L);

        // when & then
        mockMvc.perform(multipart("/api/v1/fixed-sales")
                        .file(image)
                        .param("productName", "테스트 상품")
                        .param("description", "테스트 설명")
                        .param("category", "ETC")
                        .param("price", "1000")
                        .param("stock", "10")
                        .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("필수 파라미터 누락 시 400 에러 반환")
    @WithMockUser(username = "1")
    void registerFixedSaleFail() throws Exception {
        // when & then
        mockMvc.perform(multipart("/api/v1/fixed-sales")
                        .param("productName", "") // Blank
                        .with(csrf()))
                .andExpect(status().isBadRequest());
    }
}
