package com.auction.backend.domain.purchaserequest.service;

import com.auction.backend.domain.purchaserequest.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.purchaserequest.entity.PurchaseRequest;
import com.auction.backend.domain.purchaserequest.repository.PurchaseRequestRepository;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PurchaseRequestServiceTest {

    @InjectMocks
    private PurchaseRequestService purchaseRequestService;

    @Mock
    private PurchaseRequestRepository purchaseRequestRepository;

    @Mock
    private FixedSaleRepository fixedSaleRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("구매 요청 성공")
    void createPurchaseRequest_Success() {
        // given
        Long userId = 1L;
        Long fixedSaleId = 10L;
        
        PurchaseRequestCreateRequest request = new PurchaseRequestCreateRequest();
        request.setFixedSaleId(fixedSaleId);
        request.setQuantity(2);

        User buyer = mock(User.class);
        
        User seller = mock(User.class);
        given(seller.getUserId()).willReturn(2L);

        FixedSale fixedSale = FixedSale.builder()
                .user(seller)
                .stock(10)
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(buyer));
        given(fixedSaleRepository.findById(fixedSaleId)).willReturn(Optional.of(fixedSale));

        // when
        purchaseRequestService.createPurchaseRequest(userId, request);

        // then
        verify(purchaseRequestRepository).save(any(PurchaseRequest.class));
    }

    @Test
    @DisplayName("자신의 상품 구매 요청 시 예외 발생")
    void createPurchaseRequest_SelfPurchase_Fail() {
        // given
        Long userId = 1L;
        Long fixedSaleId = 10L;

        PurchaseRequestCreateRequest request = new PurchaseRequestCreateRequest();
        request.setFixedSaleId(fixedSaleId);
        request.setQuantity(2);

        User user = mock(User.class);
        given(user.getUserId()).willReturn(userId);

        FixedSale fixedSale = FixedSale.builder()
                .user(user)
                .stock(10)
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(fixedSaleRepository.findById(fixedSaleId)).willReturn(Optional.of(fixedSale));

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
                () -> purchaseRequestService.createPurchaseRequest(userId, request));
        assertThat(exception.getMessage()).isEqualTo("자신의 상품은 구매할 수 없습니다.");
    }

    @Test
    @DisplayName("재고 부족 시 예외 발생")
    void createPurchaseRequest_LowStock_Fail() {
        // given
        Long userId = 1L;
        Long fixedSaleId = 10L;

        PurchaseRequestCreateRequest request = new PurchaseRequestCreateRequest();
        request.setFixedSaleId(fixedSaleId);
        request.setQuantity(20);

        User buyer = mock(User.class);
        
        User seller = mock(User.class);
        given(seller.getUserId()).willReturn(2L);

        FixedSale fixedSale = FixedSale.builder()
                .user(seller)
                .stock(10)
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(buyer));
        given(fixedSaleRepository.findById(fixedSaleId)).willReturn(Optional.of(fixedSale));

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
                () -> purchaseRequestService.createPurchaseRequest(userId, request));
        assertThat(exception.getMessage()).isEqualTo("재고가 부족합니다.");
    }
}
