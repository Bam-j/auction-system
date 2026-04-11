package com.auction.backend.domain.product.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.exception.auth.UnauthorizedAccessException;
import com.auction.backend.global.utils.TextFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductCommandService 단위 테스트")
class ProductCommandServiceTest {

    @InjectMocks
    private ProductCommandService productCommandService;

    @Mock
    private ProductQueryService productQueryService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private TextFilter textFilter;

    @Test
    @DisplayName("상품 등록 성공")
    void createProduct_Success() {
        // given
        User user = User.builder().nickname("seller").build();
        String productName = "Test Product";
        String description = "Test Description";
        String imageUrl = "http://image.com";
        ProductCategory category = ProductCategory.ETC;

        Product product = Product.builder()
                .user(user)
                .productName(productName)
                .description(description)
                .imageUrl(imageUrl)
                .category(category)
                .salesStatus(SalesStatus.AUCTION)
                .build();

        given(productRepository.save(any(Product.class))).willReturn(product);

        // when
        Product result = productCommandService.createProduct(user, productName, description, imageUrl, category);

        // then
        assertThat(result.getProductName()).isEqualTo(productName);
        assertThat(result.getSalesStatus()).isEqualTo(SalesStatus.AUCTION);
        verify(textFilter).validateProductText("상품명", productName);
        verify(textFilter).validateProductText("상품 설명", description);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("상품 판매 종료 성공")
    void endSale_Success() {
        // given
        Long productId = 1L;
        Long userId = 1L;
        User user = User.builder().nickname("seller").build();
        ReflectionTestUtils.setField(user, "userId", userId);

        Product product = Product.builder()
                .user(user)
                .salesStatus(SalesStatus.AUCTION)
                .build();
        ReflectionTestUtils.setField(product, "productId", productId);

        given(productQueryService.getProduct(productId)).willReturn(product);

        // when
        productCommandService.endSale(productId, userId);

        // then
        assertThat(product.getSalesStatus()).isEqualTo(SalesStatus.SOLD_OUT);
    }

    @Test
    @DisplayName("상품 소유자가 아닐 때 판매 종료 시 예외 발생")
    void endSale_Fail_Unauthorized() {
        // given
        Long productId = 1L;
        Long userId = 1L;
        Long otherUserId = 2L;
        User user = User.builder().nickname("seller").build();
        ReflectionTestUtils.setField(user, "userId", userId);

        Product product = Product.builder()
                .user(user)
                .build();

        given(productQueryService.getProduct(productId)).willReturn(product);

        // when & then
        assertThatThrownBy(() -> productCommandService.endSale(productId, otherUserId))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("상품 소유자만 판매를 종료할 수 있습니다.");
    }

    @Test
    @DisplayName("상품 등록 취소 성공")
    void cancelProduct_Success() {
        // given
        Long productId = 1L;
        Long userId = 1L;
        User user = User.builder().nickname("seller").build();
        ReflectionTestUtils.setField(user, "userId", userId);

        Product product = Product.builder()
                .user(user)
                .salesStatus(SalesStatus.AUCTION)
                .build();

        given(productQueryService.getProduct(productId)).willReturn(product);

        // when
        productCommandService.cancelProduct(productId, userId);

        // then
        assertThat(product.getSalesStatus()).isEqualTo(SalesStatus.CANCELLED);
    }
}
