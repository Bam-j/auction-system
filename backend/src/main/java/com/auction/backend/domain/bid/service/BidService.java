package com.auction.backend.domain.bid.service;

import com.auction.backend.domain.bid.dto.BidResponse;
import com.auction.backend.domain.bid.entity.Bid;
import com.auction.backend.domain.bid.repository.BidRepository;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BidService {

    private final BidRepository bidRepository;
    private final UserRepository userRepository;

    public List<BidResponse> getMyBids(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return bidRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BidResponse convertToResponse(Bid bid) {
        return BidResponse.builder()
                .id(bid.getBidId())
                .productName(bid.getAuction().getProduct().getProductName())
                .bidderName(bid.getUser().getNickname())
                .sellerName(bid.getAuction().getProduct().getUser().getNickname())
                .bidPrice(bid.getBidPrice())
                .priceUnit(bid.getAuction().getPriceUnit().name())
                .status(bid.getBidStatus())
                .bidDate(bid.getCreatedAt())
                .build();
    }
}
