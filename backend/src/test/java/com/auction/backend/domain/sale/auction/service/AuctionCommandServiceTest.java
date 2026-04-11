package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.bid.service.BidQueryService;
import com.auction.backend.domain.notification.service.NotificationCommandService;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.product.service.ProductCommandService;
import com.auction.backend.domain.sale.auction.dto.AuctionRegisterRequest;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.exception.auth.UserUnverifiedException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuctionCommandService 단위 테스트")
class AuctionCommandServiceTest {

    @InjectMocks
    private AuctionCommandService auctionCommandService;

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private ProductCommandService productCommandService;

    @Mock
    private NotificationCommandService notificationCommandService;

    @Mock
    private BidQueryService bidQueryService;

    @Mock
    private BidRepository bidRepository;

    @Test
    @DisplayName("경매 상품 등록 성공")
    void registerAuction_Success() {
        // given
        Long userId = 1L;
        AuctionRegisterRequest request = new AuctionRegisterRequest();
        request.setProductName("Auction Product");
        request.setDescription("Description");
        request.setStartPrice(1000);
        request.setMinBidIncrement(100);
        request.setInstantPurchasePrice(5000);
        request.setCategory(ProductCategory.ETC);
        request.setPriceUnit(PriceUnit.EMERALD_BLOCK);
        request.setEndedAt(LocalDateTime.now().plusDays(1));

        String imageUrl = "http://image.com";

        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "isVerified", true);
        
        Product product = Product.builder().user(user).productName("Auction Product").build();

        given(userQueryService.getUser(userId)).willReturn(user);
        given(productCommandService.createProduct(any(), any(), any(), any(), any())).willReturn(product);

        // when
        auctionCommandService.registerAuction(userId, request, imageUrl);

        // then
        verify(auctionRepository).save(any(Auction.class));
    }

    @Test
    @DisplayName("미인증 사용자의 경매 상품 등록 시 예외 발생")
    void registerAuction_Fail_Unverified() {
        // given
        Long userId = 1L;
        AuctionRegisterRequest request = new AuctionRegisterRequest();
        User user = User.builder().build();
        ReflectionTestUtils.setField(user, "isVerified", false);

        given(userQueryService.getUser(userId)).willReturn(user);

        // when & then
        assertThatThrownBy(() -> auctionCommandService.registerAuction(userId, request, "url"))
                .isInstanceOf(UserUnverifiedException.class)
                .hasMessageContaining("이메일 인증이 완료되지 않은 계정은 상품을 등록할 수 없습니다.");
    }

    @Test
    @DisplayName("경매 종료 처리 성공 (낙찰자 있음)")
    void endAuction_WithWinner() {
        // given
        User seller = User.builder().nickname("seller").build();
        Product product = Product.builder().user(seller).productName("Auction Product").salesStatus(SalesStatus.AUCTION).build();
        Auction auction = Auction.builder()
                .product(product)
                .user(seller)
                .build();
        ReflectionTestUtils.setField(auction, "auctionId", 1L);

        User winner = User.builder().nickname("winner").build();
        Bid winnerBid = Bid.builder().user(winner).bidPrice(2000).build();

        given(bidQueryService.getHighestBid(auction)).willReturn(Optional.of(winnerBid));

        // when
        auctionCommandService.endAuction(auction);

        // then
        assertThat(product.getSalesStatus()).isEqualTo(SalesStatus.SOLD_OUT);
        verify(notificationCommandService, times(2)).send(any(), any(), any(), any());
    }
}
