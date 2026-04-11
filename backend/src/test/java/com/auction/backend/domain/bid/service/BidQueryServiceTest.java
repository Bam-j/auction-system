package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.PriceUnit;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
@DisplayName("BidQueryService 단위 테스트")
class BidQueryServiceTest {

    @InjectMocks
    private BidQueryService bidQueryService;

    @Mock
    private BidRepository bidRepository;

    @Mock
    private UserQueryService userQueryService;

    @Test
    @DisplayName("모든 입찰 기록 조회 성공")
    void getAllBids_Success() {
        // given
        User bidder = User.builder().nickname("bidder").build();
        User seller = User.builder().nickname("seller").build();
        Product product = Product.builder().productName("Product").user(seller).build();
        Auction auction = Auction.builder().product(product).priceUnit(PriceUnit.EMERALD).endedAt(LocalDateTime.now().plusDays(1)).build();
        Bid bid = Bid.builder().user(bidder).auction(auction).bidPrice(1000).build();
        
        given(bidRepository.findByFiltersWithQueryDSL(any(), any(), any(), any())).willReturn(List.of(bid));

        // when
        List<BidResponse> result = bidQueryService.getAllBids(null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBidderName()).isEqualTo("bidder");
    }

    @Test
    @DisplayName("나의 입찰 기록 조회 성공")
    void getMyBids_Success() {
        // given
        Long userId = 1L;
        User bidder = User.builder().nickname("bidder").build();
        User seller = User.builder().nickname("seller").build();
        Product product = Product.builder().productName("Product").user(seller).build();
        Auction auction = Auction.builder().product(product).priceUnit(PriceUnit.EMERALD).endedAt(LocalDateTime.now().plusDays(1)).build();
        Bid bid = Bid.builder().user(bidder).auction(auction).bidPrice(1000).build();

        given(userQueryService.getUser(userId)).willReturn(bidder);
        given(bidRepository.findByUserWithFiltersWithQueryDSL(eq(bidder), any(), any(), any(), any())).willReturn(List.of(bid));

        // when
        List<BidResponse> result = bidQueryService.getMyBids(userId, null, null, null, null);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBidderName()).isEqualTo("bidder");
    }

    @Test
    @DisplayName("최고 입찰가 조회 성공")
    void getHighestBid_Success() {
        // given
        Auction auction = Auction.builder().build();
        Bid bid = Bid.builder().bidPrice(2000).build();
        given(bidRepository.findTopByAuctionOrderByBidPriceDesc(auction)).willReturn(Optional.of(bid));

        // when
        Optional<Bid> result = bidQueryService.getHighestBid(auction);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getBidPrice()).isEqualTo(2000);
    }

    @Test
    @DisplayName("입찰 응답 변환 테스트 - 진행 중인 경매")
    void convertToResponse_Ongoing() {
        // given
        User bidder = User.builder().nickname("bidder").build();
        User seller = User.builder().nickname("seller").build();
        Product product = Product.builder().productName("Product").user(seller).salesStatus(SalesStatus.AUCTION).build();
        Auction auction = Auction.builder().product(product).priceUnit(PriceUnit.EMERALD).endedAt(LocalDateTime.now().plusDays(1)).build();
        Bid bid = Bid.builder().user(bidder).auction(auction).bidPrice(1000).build();

        // when
        BidResponse response = bidQueryService.convertToResponse(bid);

        // then
        assertThat(response.getStatus()).isEqualTo(BidStatus.BIDDING);
    }
}
