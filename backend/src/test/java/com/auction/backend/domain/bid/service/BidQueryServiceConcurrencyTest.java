package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.sale.auction.repository.InstantBuyRequestRepository;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.fixedsalesorder.repository.FixedSaleOrderRepository;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserRole;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Bid 도메인 동시성 테스트")
class BidQueryServiceConcurrencyTest {

    @Autowired
    private BidCommandService bidCommandService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private InstantBuyRequestRepository instantBuyRequestRepository;

    @Autowired
    private FixedSaleRepository fixedSaleRepository;

    @Autowired
    private FixedSaleOrderRepository fixedSaleOrderRepository;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private User seller;
    private List<User> bidders = new ArrayList<>();
    private Auction auction;

    @BeforeEach
    void setUp() {
        // given: 초기 데이터 세팅
        fixedSaleOrderRepository.deleteAll();
        purchaseRequestRepository.deleteAll();
        instantBuyRequestRepository.deleteAll();
        bidRepository.deleteAll();

        fixedSaleRepository.deleteAll();
        auctionRepository.deleteAll();

        productRepository.deleteAll();
        userRepository.deleteAll();

        Assertions.assertNotNull(redisTemplate.getConnectionFactory());
        redisTemplate.getConnectionFactory().getConnection().flushAll();
        
        seller = User.builder()
                .username("seller")
                .password("password")
                .nickname("판매자")
                .role(UserRole.USER)
                .build();
        ReflectionTestUtils_setVerified(seller);
        userRepository.save(seller);

        for (int i = 1; i <= 100; i++) {
            User bidder = User.builder()
                    .username("bidder" + i)
                    .password("password")
                    .nickname("입찰자" + i)
                    .role(UserRole.USER)
                    .build();
            ReflectionTestUtils_setVerified(bidder);
            userRepository.save(bidder);
            bidders.add(bidder);
        }

        Product product = Product.builder()
                .user(seller)
                .productName("테스트 상품")
                .category(ProductCategory.ETC)
                .description("설명")
                .build();
        productRepository.save(product);

        auction = Auction.builder()
                .product(product)
                .user(seller)
                .startPrice(1000)
                .minBidIncrement(100)
                .endedAt(LocalDateTime.now().plusDays(1))
                .priceUnit(PriceUnit.EMERALD)
                .build();
        auctionRepository.save(auction);
    }

    private void ReflectionTestUtils_setVerified(User user) {
        org.springframework.test.util.ReflectionTestUtils.setField(user, "isVerified", true);
    }

    @Test
    @DisplayName("100명이 동시에 입찰할 때, 최고가가 갱신되어야 한다")
    void concurrentBidTest() throws InterruptedException {
        // given
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger();
        AtomicInteger failCount = new AtomicInteger();

        for (int i = 1; i <= threadCount; i++) {
            final int index = i - 1;
            final int bidPrice = 1000 + (i * 100);
            executorService.submit(() -> {
                try {
                    latch.await();
                    bidCommandService.createBid(bidders.get(index).getUserId(), new BidCreateRequest(auction.getAuctionId(), bidPrice));
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        // when
        latch.countDown();
        doneLatch.await();

        // then
        // 입찰 성공이 최소 하나 이상은 있어야 하며, 최종 가격은 입찰가 중 하나여야 함
        // (동시성에 의해 11000이 반드시 최종가가 아닐 수 있지만, 락이 잘 동작한다면 최종가는 시도된 가격 중 하나여야 함)
        // 하지만 이 테스트의 원래 의도는 11000에 도달하는 것이었으므로, 순차적으로 실행되었다면 11000이어야 함.
        
        Auction updatedAuction = auctionRepository.findById(auction.getAuctionId()).orElseThrow();
        assertThat(updatedAuction.getCurrentPrice()).isGreaterThanOrEqualTo(1100);
        
        // 11000 입찰이 성공했다면 최종가는 11000이어야 함
        // 모든 입찰자가 서로 다른 유저이므로 순서에 상관없이 결국 11000까지 올라가게 됨 (더 낮은 입찰은 무시되더라도)
        assertThat(updatedAuction.getCurrentPrice()).isEqualTo(11000);
        
        executorService.shutdown();
    }
}
