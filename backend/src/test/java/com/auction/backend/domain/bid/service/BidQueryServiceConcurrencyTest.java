package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.sale.auction.repository.InstantBuyRequestRepository;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.sale.fixedsale.repository.FixedSaleRepository;
import com.auction.backend.domain.fixedsalesorder.repository.FixedSalesOrderRepository;
import com.auction.backend.domain.sale.fixedsale.repository.PurchaseRequestRepository;
import com.auction.backend.domain.user.entity.User;
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

import java.time.LocalDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class BidQueryServiceConcurrencyTest {

    @Autowired
    private BidQueryService bidQueryService;

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
    private FixedSalesOrderRepository fixedSalesOrderRepository;

    @Autowired
    private PurchaseRequestRepository purchaseRequestRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private User seller;
    private User bidder;
    private Auction auction;

    @BeforeEach
    void setUp() {
        //테이블 간 연관 관계 신경써서 삭제
        fixedSalesOrderRepository.deleteAll();
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
                .build();
        userRepository.save(seller);

        bidder = User.builder()
                .username("bidder")
                .password("password")
                .nickname("입찰자")
                .build();
        userRepository.save(bidder);


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

    @Test
    @DisplayName("100명이 동시에 입찰할 때, Redis를 이용해 순차적으로 최고가가 갱신되어야 한다")
    void concurrentBidTest() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger();
        AtomicInteger failCount = new AtomicInteger();

        for (int i = 1; i <= threadCount; i++) {
            final int bidPrice = 1000 + (i * 100);
            executorService.submit(() -> {
                try {
                    latch.await();
                    bidQueryService.createBid(bidder.getUserId(), new BidCreateRequest(auction.getAuctionId(), bidPrice));
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        latch.countDown();
        doneLatch.await();

        System.out.println("최종 입찰 성공 횟수: " + successCount.get());
        System.out.println("최종 입찰 실패 횟수: " + failCount.get());

        String redisKey = "auction:price:" + auction.getAuctionId();
        Object redisPrice = redisTemplate.opsForValue().get(redisKey);

        System.out.println("Redis 최종 가격: " + redisPrice);

        assertThat(Integer.parseInt(redisPrice.toString())).isEqualTo(11000);

        Auction updatedAuction = auctionRepository.findById(auction.getAuctionId()).orElseThrow();
        assertThat(updatedAuction.getCurrentPrice()).isEqualTo(11000);
    }
}
