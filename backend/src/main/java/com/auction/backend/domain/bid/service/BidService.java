package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidCreateRequest;
import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BidService {

    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    private static final String AUCTION_PRICE_KEY = "auction:price:";

    @Transactional
    public Long createBid(Long userId, BidCreateRequest request) {
        log.info("Creating bid for user: {}, auction: {}, price: {}", 
                userId, request.getAuctionId(), request.getBidPrice());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Auction auction = auctionRepository.findById(request.getAuctionId())
                .orElseThrow(() -> new RuntimeException("경매 정보를 찾을 수 없습니다."));

        if (auction.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("자신의 경매 상품에는 입찰할 수 없습니다.");
        }

        String redisKey = AUCTION_PRICE_KEY + auction.getAuctionId();
        
        String script =
            "local current_price = redis.call('get', KEYS[1]) " +
            "if not current_price then " +
            "  redis.call('set', KEYS[1], ARGV[2]) " +
            "  current_price = ARGV[2] " +
            "end " +
            "if tonumber(ARGV[1]) >= tonumber(current_price) + tonumber(ARGV[3]) then " +
            "  redis.call('set', KEYS[1], ARGV[1]) " +
            "  return 1 " +
            "else " +
            "  return 0 " +
            "end";

        org.springframework.data.redis.core.script.DefaultRedisScript<Long> redisScript = new org.springframework.data.redis.core.script.DefaultRedisScript<>();
        redisScript.setScriptText(script);
        redisScript.setResultType(Long.class);

        // Redis에 값이 없을 경우 초기값 설정 (이미 있으면 무시)
        redisTemplate.opsForValue().setIfAbsent(redisKey, auction.getCurrentPrice());

        Long result = redisTemplate.execute(redisScript,
                java.util.Collections.singletonList(redisKey), 
                request.getBidPrice(), 
                auction.getCurrentPrice(), 
                auction.getMinBidIncrement());

        if (result == null || result == 0) {
            Object currentRedisPrice = redisTemplate.opsForValue().get(redisKey);
            log.warn("Bid failed. requestPrice: {}, currentRedisPrice: {}", request.getBidPrice(), currentRedisPrice);
            throw new RuntimeException("입찰 가격이 현재가보다 낮거나 최소 입찰 단위를 충족하지 못했습니다.");
        }

        auction.updateCurrentPrice(request.getBidPrice());
        
        Bid bid = Bid.createBid(user, auction, request.getBidPrice());
        bidRepository.save(bid);

        return bid.getBidId();
    }

    public List<BidResponse> getMyBids(Long userId, String category, String status, String searchType, String keyword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        ProductCategory productCategory = null;
        if (category != null && !category.equals("ALL") && !category.isEmpty()) {
            productCategory = ProductCategory.valueOf(category);
        }

        BidStatus bidStatus = null;
        if (status != null && !status.equals("ALL") && !status.isEmpty()) {
            bidStatus = BidStatus.valueOf(status);
        }

        String searchKeyword = keyword;
        if (keyword != null && keyword.isEmpty()) {
            searchKeyword = null;
        }

        String stype = searchType;
        if (searchType != null && (searchType.isEmpty() || searchType.equals("ALL"))) {
            stype = null;
        }

        return bidRepository.findByUserWithFilters(user, productCategory, bidStatus, stype, searchKeyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BidResponse convertToResponse(Bid bid) {
        BidStatus status = bid.getBidStatus();
        Auction auction = bid.getAuction();
        Product product = auction.getProduct();

        boolean isEnded = LocalDateTime.now().isAfter(auction.getEndedAt()) ||
                product.getSalesStatus() == SalesStatus.SOLD_OUT ||
                product.getSalesStatus() == SalesStatus.INSTANT_BUY;

        if (isEnded) {
            if (product.getSalesStatus() == SalesStatus.INSTANT_BUY) {
                status = BidStatus.FAILED;
            } else {
                if (bid.getBidPrice().equals(auction.getCurrentPrice())) {
                    status = BidStatus.SUCCESS;
                } else {
                    status = BidStatus.FAILED;
                }
            }
        }

        return BidResponse.builder()
                .id(bid.getBidId())
                .productId(product.getProductId())
                .productName(product.getProductName())
                .bidderName(bid.getUser().getNickname())
                .sellerName(product.getUser().getNickname())
                .bidPrice(bid.getBidPrice())
                .priceUnit(getPriceUnitDisplayName(auction.getPriceUnit()))
                .status(status)
                .bidDate(bid.getCreatedAt())
                .build();
    }

    private String getPriceUnitDisplayName(PriceUnit unit) {
        if (unit == null) return "에메랄드";
        return switch (unit) {
            case EMERALD -> "에메랄드";
            case EMERALD_BLOCK -> "에메랄드 블록";
            case EMERALD_COIN -> "에메랄드 주화";
        };
    }
}
