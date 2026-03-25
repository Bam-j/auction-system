package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.dto.BidSearchCondition;
import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.PriceUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BidQueryService {

    private final BidRepository bidRepository;
    private final UserQueryService userQueryService;

    //시스템에 등록된 모든 입찰 조회
    public List<BidResponse> getAllBids(String category, String status, String searchType, String keyword) {
        BidSearchCondition condition = BidSearchCondition.of(category, status, keyword, searchType);

        return bidRepository.findByFilters(
                        condition.getCategory(),
                        condition.getStatus(),
                        condition.getSearchType(),
                        condition.getKeyword()
                ).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    //자신의 입찰 기록 조회
    public List<BidResponse> getMyBids(Long userId, String category, String status, String searchType, String keyword) {
        User user = userQueryService.getUser(userId);
        BidSearchCondition condition = BidSearchCondition.of(category, status, keyword, searchType);

        return bidRepository.findByUserWithFilters(
                        user,
                        condition.getCategory(),
                        condition.getStatus(),
                        condition.getSearchType(),
                        condition.getKeyword()
                ).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    //현재 최고 입찰자 조회
    public Optional<Bid> getHighestBid(Auction auction) {
        return bidRepository.findTopByAuctionOrderByBidPriceDesc(auction);
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
                .priceUnit(PriceUnit.getDisplayName(auction.getPriceUnit()))
                .status(status)
                .bidDate(bid.getCreatedAt())
                .build();
    }
}
