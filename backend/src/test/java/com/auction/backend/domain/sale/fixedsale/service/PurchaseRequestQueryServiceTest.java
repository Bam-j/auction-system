package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.RequestStatus;
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
@DisplayName("PurchaseRequestQueryService 단위 테스트")
class PurchaseRequestQueryServiceTest {

    @InjectMocks
    private PurchaseRequestQueryService purchaseRequestQueryService;

    @Mock
    private PurchaseRequestRepository purchaseRequestRepository;

    @Mock
    private UserQueryService userQueryService;

    @Test
    @DisplayName("모든 구매 요청 조회 성공")
    void getAllPurchaseRequests_Success() {
        // given
        User buyer = User.builder().nickname("buyer").build();
        User seller = User.builder().nickname("seller").build();
        Product product = Product.builder().productName("Product").build();
        FixedSale fixedSale = FixedSale.builder().product(product).user(seller).build();
        PurchaseRequest request = PurchaseRequest.builder()
                .user(buyer)
                .fixedSale(fixedSale)
                .requestStatus(RequestStatus.PENDING)
                .build();

        given(purchaseRequestRepository.findByFiltersWithQueryDSL(any(), any(), any(), any())).willReturn(List.of(request));

        // when
        List<PurchaseRequestResponse> result = purchaseRequestQueryService.getAllPurchaseRequests(null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductName()).isEqualTo("Product");
    }

    @Test
    @DisplayName("사용자별 구매 요청 조회 성공")
    void getUserPurchaseRequests_Success() {
        // given
        Long userId = 1L;
        User buyer = User.builder().nickname("buyer").build();
        User seller = User.builder().nickname("seller").build();
        Product product = Product.builder().productName("My Product").build();
        FixedSale fixedSale = FixedSale.builder().product(product).user(seller).build();
        PurchaseRequest request = PurchaseRequest.builder()
                .user(buyer)
                .fixedSale(fixedSale)
                .requestStatus(RequestStatus.PENDING)
                .build();
        
        given(userQueryService.getUser(userId)).willReturn(buyer);
        // Repository method has 5 parameters: User, ProductCategory, RequestStatus, String(searchType), String(keyword)
        given(purchaseRequestRepository.findByUserWithFiltersWithQueryDSL(any(), any(), any(), any(), any())).willReturn(List.of(request));

        // when
        List<PurchaseRequestResponse> result = purchaseRequestQueryService.getUserPurchaseRequests(userId, null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductName()).isEqualTo("My Product");
    }
}
