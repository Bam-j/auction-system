package com.auction.backend.domain.sale.fixedsale.service;

import com.auction.backend.domain.sale.fixedsale.dto.PurchaseRequestCreateRequest;
import com.auction.backend.domain.sale.fixedsale.entity.PurchaseRequest;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.sale.fixedsale.entity.FixedSale;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.global.exception.domain.SelfPurchaseException;
import com.auction.backend.domain.sale.fixedsale.exception.InsufficientStockException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PurchaseRequestCommandServiceTest {

    @InjectMocks
    private PurchaseRequestCommandService purchaseRequestCommandService;

    @Mock
    private PurchaseRequestRepository purchaseRequestRepository;

    @Mock
    private FixedSaleQueryService fixedSaleQueryService;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private NotificationCommandService notificationCommandService;

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
        given(buyer.isVerified()).willReturn(true);
        
        User seller = mock(User.class);
        given(seller.getUserId()).willReturn(2L);

        Product product = mock(Product.class);
        given(product.getProductName()).willReturn("테스트 상품");
        given(product.getProductId()).willReturn(100L);

        FixedSale fixedSale = FixedSale.builder()
                .user(seller)
                .product(product)
                .stock(10)
                .build();

        given(userQueryService.getUser(userId)).willReturn(buyer);
        given(fixedSaleQueryService.getFixedSale(fixedSaleId)).willReturn(fixedSale);

        // when
        purchaseRequestCommandService.createPurchaseRequest(userId, request);

        // then
        verify(purchaseRequestRepository).save(any(PurchaseRequest.class));
        verify(notificationCommandService).send(any(), any(), anyString(), anyLong());
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
        given(user.isVerified()).willReturn(true);

        FixedSale fixedSale = FixedSale.builder()
                .user(user)
                .stock(10)
                .build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(fixedSaleQueryService.getFixedSale(fixedSaleId)).willReturn(fixedSale);

        // when & then
        assertThrows(SelfPurchaseException.class, 
                () -> purchaseRequestCommandService.createPurchaseRequest(userId, request));
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
        given(buyer.isVerified()).willReturn(true);
        
        User seller = mock(User.class);
        given(seller.getUserId()).willReturn(2L);

        FixedSale fixedSale = FixedSale.builder()
                .user(seller)
                .stock(10)
                .build();

        given(userQueryService.getUser(userId)).willReturn(buyer);
        given(fixedSaleQueryService.getFixedSale(fixedSaleId)).willReturn(fixedSale);

        // when & then
        assertThrows(InsufficientStockException.class, 
                () -> purchaseRequestCommandService.createPurchaseRequest(userId, request));
    }
}
