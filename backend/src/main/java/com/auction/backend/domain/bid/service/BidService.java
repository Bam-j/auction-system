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

    @Transactional
    public Long createBid(Long userId, BidCreateRequest request) {
        log.info("Creating bid for user: {}, auction: {}, price: {}", 
                userId, request.getAuctionId(), request.getBidPrice());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Auction auction = auctionRepository.findById(request.getAuctionId())
                .orElseThrow(() -> new RuntimeException("경매 정보를 찾을 수 없습니다."));

        // 본인 경매 입찰 방지
        if (auction.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("자신의 경매 상품에는 입찰할 수 없습니다.");
        }

        // 경매 최고가 업데이트 (엔티티 내부에서 검증 로직 수행)
        auction.updateCurrentPrice(request.getBidPrice());

        // 입찰 기록 생성
        Bid bid = Bid.createBid(user, auction, request.getBidPrice());
        bidRepository.save(bid);

        return bid.getBidId();
    }

    public List<BidResponse> getMyBids(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return bidRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BidResponse convertToResponse(Bid bid) {
        BidStatus status = bid.getBidStatus();
        Auction auction = bid.getAuction();
        Product product = auction.getProduct();

        // 경매가 종료되었는지 확인 (마감 기한 지남 or 상태가 SOLD_OUT/INSTANT_BUY)
        boolean isEnded = LocalDateTime.now().isAfter(auction.getEndedAt()) ||
                product.getSalesStatus() == SalesStatus.SOLD_OUT ||
                product.getSalesStatus() == SalesStatus.INSTANT_BUY;

        if (isEnded) {
            if (product.getSalesStatus() == SalesStatus.INSTANT_BUY) {
                // 즉시 구매로 판매된 경우 모든 입찰은 패찰
                status = BidStatus.FAILED;
            } else {
                // 경매 최고가(currentPrice)와 입찰가가 일치하는 경우만 낙찰(SUCCESS), 나머지는 패찰(FAILED)
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

    private String getPriceUnitDisplayName(com.auction.backend.global.enums.PriceUnit unit) {
        if (unit == null) return "에메랄드";
        return switch (unit) {
            case EMERALD -> "에메랄드";
            case EMERALD_BLOCK -> "에메랄드 블록";
            case EMERALD_COIN -> "에메랄드 주화";
        };
    }
}
