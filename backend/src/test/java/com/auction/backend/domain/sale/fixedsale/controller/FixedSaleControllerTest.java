package com.auction.backend.domain.sale.fixedsale.controller;

import com.auction.backend.domain.sale.fixedsale.service.FixedSaleCommandService;
import com.auction.backend.global.jwt.JwtTokenProvider;
import com.auction.backend.global.service.FileService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.test.web.servlet.MvcResult;

import java.util.concurrent.CompletableFuture;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FixedSaleController.class)
@DisplayName("FixedSale 도메인 컨트롤러 테스트")
class FixedSaleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FixedSaleCommandService fixedSaleCommandService;

    @MockitoBean
    private FileService fileService;

    @MockitoBean(name = "taskExecutor")
    private AsyncTaskExecutor taskExecutor;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("상품 등록 성공 테스트")
    @WithMockUser(username = "1")
    void registerFixedSaleSuccess() throws Exception {
        // given
        MockMultipartFile image = new MockMultipartFile(
                "image", "test.jpg", "image/jpeg", "test image".getBytes());

        given(fileService.uploadFileAsync(any())).willReturn(CompletableFuture.completedFuture("/uploads/test.jpg"));
        given(fixedSaleCommandService.registerFixedSale(anyLong(), any(), anyString())).willReturn(1L);

        doAnswer(invocation -> {
            Runnable runnable = invocation.getArgument(0);
            runnable.run();
            return null;
        }).when(taskExecutor).execute(any(Runnable.class));

        // when
        MvcResult result = mockMvc.perform(multipart("/api/v1/fixed-sales")
                        .file(image)
                        .param("productName", "테스트 상품")
                        .param("description", "테스트 설명")
                        .param("category", "ETC")
                        .param("price", "1000")
                        .param("stock", "10")
                        .with(csrf()))
                .andReturn();

        // then
        mockMvc.perform(asyncDispatch(result))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("필수 파라미터 누락 시 400 에러 반환")
    @WithMockUser(username = "1")
    void registerFixedSaleFail() throws Exception {
        // given
        // productName이 비어있는 상황

        // when & then
        mockMvc.perform(multipart("/api/v1/fixed-sales")
                        .param("productName", "") // Blank
                        .with(csrf()))
                .andExpect(status().isBadRequest());
    }
}
