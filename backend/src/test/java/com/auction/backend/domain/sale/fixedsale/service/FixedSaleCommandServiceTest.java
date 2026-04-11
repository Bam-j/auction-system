package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.service.ProductCommandService;
import com.auction.backend.domain.sale.fixedsale.dto.FixedSaleRegisterRequest;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.exception.auth.UserUnverifiedException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("FixedSaleCommandService 단위 테스트")
class FixedSaleCommandServiceTest {

    @InjectMocks
    private FixedSaleCommandService fixedSaleCommandService;

    @Mock
    private ProductCommandService productCommandService;

    @Mock
    private FixedSaleRepository fixedSaleRepository;

    @Mock
    private UserQueryService userQueryService;

    @Test
    @DisplayName("고정가 상품 등록 성공")
    void registerFixedSale_Success() {
        // given
        Long userId = 1L;
        FixedSaleRegisterRequest request = new FixedSaleRegisterRequest();
        request.setProductName("Fixed Product");
        request.setDescription("Description");
        request.setPrice("1000");
        request.setStock(10);
        request.setCategory(ProductCategory.ETC);

        String imageUrl = "http://image.com";

        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "isVerified", true);

        Product product = Product.builder().user(user).productName("Fixed Product").build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(productCommandService.createProduct(any(), any(), any(), any(), any())).willReturn(product);

        // when
        fixedSaleCommandService.registerFixedSale(userId, request, imageUrl);

        // then
        verify(fixedSaleRepository).save(any(FixedSale.class));
    }

    @Test
    @DisplayName("미인증 사용자의 고정가 상품 등록 시 예외 발생")
    void registerFixedSale_Fail_Unverified() {
        // given
        Long userId = 1L;
        FixedSaleRegisterRequest request = new FixedSaleRegisterRequest();
        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "isVerified", false);

        given(userQueryService.getUser(userId)).willReturn(user);

        // when & then
        assertThatThrownBy(() -> fixedSaleCommandService.registerFixedSale(userId, request, "url"))
                .isInstanceOf(UserUnverifiedException.class)
                .hasMessageContaining("이메일 인증이 완료되지 않은 계정은 상품을 등록할 수 없습니다.");
    }
}
