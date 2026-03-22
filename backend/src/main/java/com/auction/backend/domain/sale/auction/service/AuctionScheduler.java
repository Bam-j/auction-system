package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionCommandService auctionCommandService;

    // 1분마다 마감된 경매 체크
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkExpiredAuctions() {
        log.info("Checking expired auctions at {}", LocalDateTime.now());

        List<Auction> expiredAuctions = auctionRepository.findByEndedAtBeforeAndProductSalesStatus(
                LocalDateTime.now(), SalesStatus.AUCTION);

        for (Auction auction : expiredAuctions) {
            auctionCommandService.endAuction(auction);
        }
    }
}
