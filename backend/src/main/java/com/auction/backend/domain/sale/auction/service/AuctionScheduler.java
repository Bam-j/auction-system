package com.auction.backend.domain.sale.auction.service;

import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.sale.auction.entity.Auction;
import com.auction.backend.domain.sale.auction.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionCommandService auctionCommandService;

    //1분마다 마감된 경매 체크
    @Scheduled(fixedRate = 60000)
    public void checkExpiredAuctions() {
        log.info("Checking expired auctions at {}", LocalDateTime.now());

        LocalDateTime now = LocalDateTime.now();
        PageRequest pageRequest = PageRequest.of(0, 50); //1회에 50개씩 분산 처리
        Slice<Auction> auctionSlice;

        do {
            auctionSlice = auctionRepository.findByEndedAtBeforeAndProductSalesStatus(
                    now, SalesStatus.AUCTION, pageRequest);

            for (Auction auction : auctionSlice.getContent()) {
                try {
                    //개별 상품마다 새로운 트랜잭션으로 처리하여 전체 실패 방지
                    auctionCommandService.endAuction(auction);
                } catch (Exception e) {
                    log.error("Failed to end auction for auctionId: {}. Error: {}",
                            auction.getAuctionId(), e.getMessage());
                }
            }

        } while (auctionSlice.hasNext());
    }
}
