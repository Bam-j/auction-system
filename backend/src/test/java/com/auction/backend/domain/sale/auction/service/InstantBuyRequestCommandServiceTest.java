package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.service.BidQueryService;
import com.auction.backend.domain.notification.entity.NotificationType;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.dto.InstantBuyCreateRequest;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.entity.InstantBuyRequest;
import com.auction.backend.domain.sale.auction.repository.InstantBuyRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.RequestStatus;
import com.auction.backend.global.exception.auth.UnauthorizedAccessException;
import com.auction.backend.global.service.RedisLockService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("InstantBuyRequestCommandService 단위 테스트")
class InstantBuyRequestCommandServiceTest {

    @InjectMocks
    private InstantBuyRequestCommandService instantBuyRequestCommandService;

    @Mock
    private InstantBuyRequestRepository instantBuyRequestRepository;

    @Mock
    private InstantBuyRequestQueryService instantBuyRequestQueryService;

    @Mock
    private AuctionQueryService auctionQueryService;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private NotificationCommandService notificationCommandService;

    @Mock
    private BidQueryService bidQueryService;

    @Mock
    private RedisLockService redisLockService;

    @Test
    @DisplayName("즉시 구매 요청 생성 성공")
    void createInstantBuyRequest_Success() {
        // given
        Long userId = 1L;
        Long auctionId = 1L;
        InstantBuyCreateRequest request = new InstantBuyCreateRequest();
        request.setAuctionId(auctionId);

        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "userId", userId);
        ReflectionTestUtils.setField(user, "isVerified", true);

        User seller = User.builder().build();
        ReflectionTestUtils.setField(seller, "userId", 2L);

        Product product = Product.builder().productName("Test Product").build();
        ReflectionTestUtils.setField(product, "productId", 1L);
        Auction auction = Auction.builder().product(product).user(seller).instantPurchasePrice(5000).build();
        ReflectionTestUtils.setField(auction, "auctionId", auctionId);

        given(userQueryService.getUser(userId)).willReturn(user);
        given(auctionQueryService.getAuction(auctionId)).willReturn(auction);

        // when
        instantBuyRequestCommandService.createInstantBuyRequest(userId, request);

        // then
        verify(instantBuyRequestRepository).save(any(InstantBuyRequest.class));
        verify(notificationCommandService).send(eq(seller), eq(NotificationType.INSTANT_BUY_REQUEST_RECEIVED), anyString(), eq(1L));
    }

    @Test
    @DisplayName("즉시 구매 요청 승인 성공")
    void approveInstantBuyRequest_Success() {
        // given
        Long sellerId = 1L;
        Long requestId = 1L;

        User seller = User.builder().build();
        ReflectionTestUtils.setField(seller, "userId", sellerId);

        User requester = User.builder().build();
        ReflectionTestUtils.setField(requester, "userId", 2L);

        Product product = Product.builder().salesStatus(SalesStatus.AUCTION).productName("Product").build();
        Auction auction = Auction.builder().product(product).user(seller).build();
        ReflectionTestUtils.setField(auction, "auctionId", 1L);

        InstantBuyRequest request = InstantBuyRequest.builder().user(requester).auction(auction).build();
        ReflectionTestUtils.setField(request, "requestStatus", RequestStatus.PENDING);

        given(instantBuyRequestQueryService.getRequest(requestId)).willReturn(request);
        given(redisLockService.runWithLock(anyString(), any(Supplier.class)))
                .willAnswer(invocation -> {
                    Supplier<?> action = invocation.getArgument(1);
                    return action.get();
                });
        given(bidQueryService.getBidsByAuction(auction)).willReturn(List.of());

        // when
        instantBuyRequestCommandService.approveInstantBuyRequest(sellerId, requestId);

        // then
        assertThat(request.getRequestStatus()).isEqualTo(RequestStatus.APPROVED);
        assertThat(product.getSalesStatus()).isEqualTo(SalesStatus.INSTANT_BUY);
        verify(notificationCommandService).send(eq(requester), eq(NotificationType.INSTANT_BUY_REQUEST_APPROVED), anyString(), any());
    }

    @Test
    @DisplayName("즉시 구매 요청 거절 성공")
    void rejectInstantBuyRequest_Success() {
        // given
        Long sellerId = 1L;
        Long requestId = 1L;

        User seller = User.builder().build();
        ReflectionTestUtils.setField(seller, "userId", sellerId);

        User requester = User.builder().build();
        ReflectionTestUtils.setField(requester, "userId", 2L);

        Product product = Product.builder().productName("Product").build();
        Auction auction = Auction.builder().product(product).user(seller).build();
        InstantBuyRequest request = InstantBuyRequest.builder().user(requester).auction(auction).build();
        ReflectionTestUtils.setField(request, "requestStatus", RequestStatus.PENDING);

        given(instantBuyRequestQueryService.getRequest(requestId)).willReturn(request);

        // when
        instantBuyRequestCommandService.rejectInstantBuyRequest(sellerId, requestId);

        // then
        assertThat(request.getRequestStatus()).isEqualTo(RequestStatus.REJECTED);
        verify(notificationCommandService).send(eq(requester), eq(NotificationType.INSTANT_BUY_REQUEST_REJECTED), anyString(), any());
    }

    @Test
    @DisplayName("판매자가 아닌 사용자가 즉시 구매 요청 승인 시 예외 발생")
    void approveInstantBuyRequest_Fail_Unauthorized() {
        // given
        Long otherId = 999L;
        Long requestId = 1L;

        User seller = User.builder().build();
        ReflectionTestUtils.setField(seller, "userId", 1L);

        Auction auction = Auction.builder().user(seller).build();
        InstantBuyRequest request = InstantBuyRequest.builder().auction(auction).build();

        given(instantBuyRequestQueryService.getRequest(requestId)).willReturn(request);

        // when & then
        assertThatThrownBy(() -> instantBuyRequestCommandService.approveInstantBuyRequest(otherId, requestId))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("판매자만 요청을 수락할 수 있습니다.");
    }
}
