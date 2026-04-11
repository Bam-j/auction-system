package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.exception.InvalidBidException;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.service.AuctionQueryService;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.exception.auth.UserUnverifiedException;
import com.auction.backend.global.exception.domain.SelfPurchaseException;
import com.auction.backend.global.service.RedisLockService;
import com.auction.backend.global.service.RedisRateLimitService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("BidCommandService 단위 테스트")
class BidCommandServiceTest {

    @InjectMocks
    private BidCommandService bidCommandService;

    @Mock
    private BidRepository bidRepository;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private AuctionQueryService auctionQueryService;

    @Mock
    private BidQueryService bidQueryService;

    @Mock
    private RedisLockService redisLockService;

    @Mock
    private RedisRateLimitService redisRateLimitService;

    @Mock
    private NotificationCommandService notificationCommandService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Test
    @DisplayName("입찰 생성 성공")
    void createBid_Success() {
        // given
        Long userId = 1L;
        Long auctionId = 1L;
        Integer bidPrice = 1500;
        BidCreateRequest request = new BidCreateRequest(auctionId, bidPrice);

        User user = User.builder().nickname("bidder").build();
        ReflectionTestUtils.setField(user, "userId", userId);
        ReflectionTestUtils.setField(user, "isVerified", true);

        User seller = User.builder().nickname("seller").build();
        ReflectionTestUtils.setField(seller, "userId", 2L);

        Product product = Product.builder().productName("Test Product").build();
        Auction auction = Auction.builder()
                .product(product)
                .user(seller)
                .startPrice(1000)
                .minBidIncrement(100)
                .endedAt(LocalDateTime.now().plusDays(1))
                .build();
        ReflectionTestUtils.setField(auction, "auctionId", auctionId);

        given(redisLockService.runWithLock(anyString(), any(Supplier.class)))
                .willAnswer(invocation -> {
                    Supplier<?> action = invocation.getArgument(1);
                    return action.get();
                });
        given(userQueryService.getUser(userId)).willReturn(user);
        given(auctionQueryService.getAuction(auctionId)).willReturn(auction);
        given(bidQueryService.getHighestBid(auction)).willReturn(Optional.empty());

        // when
        bidCommandService.createBid(userId, request);

        // then
        assertThat(auction.getCurrentPrice()).isEqualTo(bidPrice);
        verify(bidRepository).save(any(Bid.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/auction/" + auctionId), anyMap());
    }

    @Test
    @DisplayName("이메일 미인증 사용자의 입찰 시 예외 발생")
    void createBid_Fail_Unverified() {
        // given
        Long userId = 1L;
        BidCreateRequest request = new BidCreateRequest(1L, 1500);
        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "isVerified", false);

        given(redisLockService.runWithLock(anyString(), any(Supplier.class)))
                .willAnswer(invocation -> {
                    Supplier<?> action = invocation.getArgument(1);
                    return action.get();
                });
        given(userQueryService.getUser(userId)).willReturn(user);

        // when & then
        assertThatThrownBy(() -> bidCommandService.createBid(userId, request))
                .isInstanceOf(UserUnverifiedException.class)
                .hasMessageContaining("이메일 인증이 완료되지 않은 계정은 입찰할 수 없습니다.");
    }

    @Test
    @DisplayName("자신의 경매 상품에 입찰 시 예외 발생")
    void createBid_Fail_SelfPurchase() {
        // given
        Long userId = 1L;
        Long auctionId = 1L;
        BidCreateRequest request = new BidCreateRequest(auctionId, 1500);

        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "userId", userId);
        ReflectionTestUtils.setField(user, "isVerified", true);

        Auction auction = Auction.builder().user(user).build();

        given(redisLockService.runWithLock(anyString(), any(Supplier.class)))
                .willAnswer(invocation -> {
                    Supplier<?> action = invocation.getArgument(1);
                    return action.get();
                });
        given(userQueryService.getUser(userId)).willReturn(user);
        given(auctionQueryService.getAuction(auctionId)).willReturn(auction);

        // when & then
        assertThatThrownBy(() -> bidCommandService.createBid(userId, request))
                .isInstanceOf(SelfPurchaseException.class)
                .hasMessageContaining("자신의 경매 상품에는 입찰할 수 없습니다.");
    }

    @Test
    @DisplayName("입찰 가격이 현재가 + 최소 입찰 단위보다 낮을 때 예외 발생")
    void createBid_Fail_InvalidPrice() {
        // given
        Long userId = 1L;
        Long auctionId = 1L;
        BidCreateRequest request = new BidCreateRequest(auctionId, 1050); // Current (1000) + Min (100) = 1100

        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "userId", userId);
        ReflectionTestUtils.setField(user, "isVerified", true);

        User seller = User.builder().build();
        ReflectionTestUtils.setField(seller, "userId", 2L);

        Auction auction = Auction.builder()
                .user(seller)
                .startPrice(1000)
                .minBidIncrement(100)
                .build();

        given(redisLockService.runWithLock(anyString(), any(Supplier.class)))
                .willAnswer(invocation -> {
                    Supplier<?> action = invocation.getArgument(1);
                    return action.get();
                });
        given(userQueryService.getUser(userId)).willReturn(user);
        given(auctionQueryService.getAuction(auctionId)).willReturn(auction);

        // when & then
        assertThatThrownBy(() -> bidCommandService.createBid(userId, request))
                .isInstanceOf(InvalidBidException.class)
                .hasMessageContaining("입찰 가격이 현재가보다 낮거나 최소 입찰 단위를 충족하지 못했습니다.");
    }

    @Test
    @DisplayName("이미 최고 입찰자인 경우 예외 발생")
    void createBid_Fail_AlreadyHighest() {
        // given
        Long userId = 1L;
        Long auctionId = 1L;
        BidCreateRequest request = new BidCreateRequest(auctionId, 1500);

        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "userId", userId);
        ReflectionTestUtils.setField(user, "isVerified", true);

        User seller = User.builder().build();
        ReflectionTestUtils.setField(seller, "userId", 2L);

        Product product = Product.builder().productName("Test Product").build();
        Auction auction = Auction.builder()
                .product(product)
                .user(seller)
                .startPrice(1000)
                .minBidIncrement(100)
                .endedAt(LocalDateTime.now().plusDays(1))
                .build();
        ReflectionTestUtils.setField(auction, "auctionId", auctionId);

        Bid highestBid = Bid.builder().user(user).build();

        given(redisLockService.runWithLock(anyString(), any(Supplier.class)))
                .willAnswer(invocation -> {
                    Supplier<?> action = invocation.getArgument(1);
                    return action.get();
                });
        given(userQueryService.getUser(userId)).willReturn(user);
        given(auctionQueryService.getAuction(auctionId)).willReturn(auction);
        given(bidQueryService.getHighestBid(auction)).willReturn(Optional.of(highestBid));

        // when & then
        assertThatThrownBy(() -> bidCommandService.createBid(userId, request))
                .isInstanceOf(InvalidBidException.class)
                .hasMessageContaining("이미 현재 최고 입찰자입니다.");
    }
}
