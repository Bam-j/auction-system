package com.auction.backend.domain.product.scheduler;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.product.repository.ProductRepository;
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
public class ProductCleanupScheduler {

    private final ProductRepository productRepository;


    //판매 종료(SOLD_OUT, INSTANT_BUY)된 지 3개월이 지난 상품을 매일 새벽 5시에 삭제
    // 연관 데이터(경매 기록, 입찰 기록 등)도 함께 삭제
    @Transactional
    @Scheduled(cron = "0 0 5 * * *")
    public void deleteOldFinishedProducts() {
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        log.info("Starting cleanup of finished products older than {}", threeMonthsAgo);

        cleanupByStatus(SalesStatus.SOLD_OUT, threeMonthsAgo);
        cleanupByStatus(SalesStatus.INSTANT_BUY, threeMonthsAgo);
    }

    private void cleanupByStatus(SalesStatus status, LocalDateTime dateTime) {
        try {
            List<Product> productsToDelete = productRepository.findBySalesStatusAndUpdatedAtBefore(status, dateTime);

            if (!productsToDelete.isEmpty()) {
                productRepository.deleteAll(productsToDelete);
                log.info("Successfully deleted {} products with status {} and their related data.", productsToDelete.size(), status);
            }
        } catch (Exception e) {
            log.error("Error occurred during product cleanup for status {}", status, e);
        }
    }
}
