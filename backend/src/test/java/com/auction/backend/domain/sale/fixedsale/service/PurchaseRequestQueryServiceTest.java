package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestResponse;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
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
        PurchaseRequestResponse response = PurchaseRequestResponse.builder().productName("Product").build();
        given(purchaseRequestRepository.findByFiltersWithQueryDSL(any(), any(), any(), any())).willReturn(List.of(response));

        // when
        List<PurchaseRequestResponse> result = purchaseRequestQueryService.getAllPurchaseRequests(null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductName()).isEqualTo("Product");
    }

    @Test
    @DisplayName("사용자별 구매 요청 조회 성공")
    void getMyPurchaseRequests_Success() {
        // given
        Long userId = 1L;
        User user = User.builder().build();
        PurchaseRequestResponse response = PurchaseRequestResponse.builder().productName("My Product").build();
        
        given(userQueryService.getUser(userId)).willReturn(user);
        given(purchaseRequestRepository.findByUserWithFiltersWithQueryDSL(any(), any(), any(), any())).willReturn(List.of(response));

        // when
        List<PurchaseRequestResponse> result = purchaseRequestQueryService.getMyPurchaseRequests(userId, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductName()).isEqualTo("My Product");
    }
}
