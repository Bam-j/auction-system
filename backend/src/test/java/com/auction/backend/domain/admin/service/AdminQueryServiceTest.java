package com.auction.backend.domain.admin.service;

import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.service.BidQueryService;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.service.ProductQueryService;
import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.sale.fixedsale.service.PurchaseRequestQueryService;
import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.service.UserQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminQueryService 단위 테스트")
class AdminQueryServiceTest {

    @InjectMocks
    private AdminQueryService adminQueryService;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private ProductQueryService productQueryService;

    @Mock
    private PurchaseRequestQueryService purchaseRequestQueryService;

    @Mock
    private BidQueryService bidQueryService;

    @Test
    @DisplayName("모든 회원 조회 성공")
    void getAllUsers_Success() {
        // given
        UserResponse response = UserResponse.builder().username("user").build();
        given(userQueryService.getAllUsers(any(), any())).willReturn(List.of(response));

        // when
        List<UserResponse> result = adminQueryService.getAllUsers(null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsername()).isEqualTo("user");
    }

    @Test
    @DisplayName("모든 상품 조회 성공")
    void getAllProducts_Success() {
        // given
        ProductListResponse response = ProductListResponse.builder().title("product").build();
        given(productQueryService.getAllProducts(any(), any(), any(), any())).willReturn(List.of(response));

        // when
        List<ProductListResponse> result = adminQueryService.getAllProducts(null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("product");
    }

    @Test
    @DisplayName("모든 구매 요청 조회 성공")
    void getAllPurchaseRequests_Success() {
        // given
        PurchaseRequestResponse response = PurchaseRequestResponse.builder().productName("request").build();
        given(purchaseRequestQueryService.getAllPurchaseRequests(any(), any(), any(), any())).willReturn(List.of(response));

        // when
        List<PurchaseRequestResponse> result = adminQueryService.getAllPurchaseRequests(null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductName()).isEqualTo("request");
    }

    @Test
    @DisplayName("모든 입찰 조회 성공")
    void getAllBids_Success() {
        // given
        BidResponse response = BidResponse.builder().productName("bid").build();
        given(bidQueryService.getAllBids(any(), any(), any(), any())).willReturn(List.of(response));

        // when
        List<BidResponse> result = adminQueryService.getAllBids(null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductName()).isEqualTo("bid");
    }
}
