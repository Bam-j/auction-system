package com.auction.backend.domain.product.service;

import com.auction.backend.domain.bid.service.BidQueryService;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.sale.auction.service.AuctionQueryService;
import com.auction.backend.domain.sale.fixedsale.service.FixedSaleQueryService;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.exception.common.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductQueryService 단위 테스트")
class ProductQueryServiceTest {

    @InjectMocks
    private ProductQueryService productQueryService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private FixedSaleQueryService fixedSaleQueryService;

    @Mock
    private AuctionQueryService auctionQueryService;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private BidQueryService bidQueryService;

    @Test
    @DisplayName("모든 상품 조회 성공")
    void getAllProducts_Success() {
        // given
        ProductListResponse response = ProductListResponse.builder()
                .title("Test Product")
                .build();
        given(productRepository.findByFiltersWithQueryDSL(any(), any(), any(), any())).willReturn(List.of(response));

        // when
        List<ProductListResponse> result = productQueryService.getAllProducts("WEAPON", "AUCTION", "title", "keyword");

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Product");
        verify(productRepository).findByFiltersWithQueryDSL(eq(ProductCategory.WEAPON), eq(SalesStatus.AUCTION), eq("title"), eq("keyword"));
    }

    @Test
    @DisplayName("특정 유저의 상품 조회 성공")
    void getUserProducts_Success() {
        // given
        Long userId = 1L;
        User user = User.builder().nickname("seller").build();
        given(userQueryService.getUser(userId)).willReturn(user);
        
        ProductListResponse response = ProductListResponse.builder()
                .title("User Product")
                .build();
        given(productRepository.findByUserWithFiltersWithQueryDSL(any(), any(), any(), any())).willReturn(List.of(response));

        // when
        List<ProductListResponse> result = productQueryService.getUserProducts(userId, "ARMOR", "FIXED_SALES", "keyword");

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("User Product");
        verify(productRepository).findByUserWithFiltersWithQueryDSL(eq(user), eq(ProductCategory.ARMOR), eq(SalesStatus.FIXED_SALES), eq("keyword"));
    }

    @Test
    @DisplayName("상품 상세 정보 조회 성공")
    void getProductDetail_Success() {
        // given
        Long productId = 1L;
        ProductListResponse response = ProductListResponse.builder()
                .id(productId)
                .title("Detail Product")
                .build();
        given(productRepository.findProductDetailWithQueryDSL(productId)).willReturn(response);

        // when
        ProductListResponse result = productQueryService.getProductDetail(productId);

        // then
        assertThat(result.getId()).isEqualTo(productId);
        assertThat(result.getTitle()).isEqualTo("Detail Product");
    }

    @Test
    @DisplayName("상품 엔티티 조회 성공")
    void getProduct_Success() {
        // given
        Long productId = 1L;
        Product product = Product.builder().productName("Entity Product").build();
        given(productRepository.findById(productId)).willReturn(Optional.of(product));

        // when
        Product result = productQueryService.getProduct(productId);

        // then
        assertThat(result.getProductName()).isEqualTo("Entity Product");
    }

    @Test
    @DisplayName("존재하지 않는 상품 조회 시 예외 발생")
    void getProduct_Fail_NotFound() {
        // given
        Long productId = 999L;
        given(productRepository.findById(productId)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> productQueryService.getProduct(productId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("상품을 찾을 수 없습니다.");
    }
}
