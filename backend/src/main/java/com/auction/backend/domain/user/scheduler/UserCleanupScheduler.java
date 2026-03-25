package com.auction.backend.domain.user.scheduler;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.repository.UserRepository;
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
public class UserCleanupScheduler {

    private final UserRepository userRepository;

    //탈퇴(soft delete)한 지 6개월 경과한 사용자를 새벽 04시에 삭제. 이때 연관 데이터도 함께 삭제
    @Transactional
    @Scheduled(cron = "0 0 4 * * *")
    public void deleteOldDeletedUsers() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        log.info("Starting cleanup of deleted users older than {}", sixMonthsAgo);

        try {
            List<User> usersToDelete = userRepository.findByStatusAndUpdatedAtBefore(UserStatus.DELETED, sixMonthsAgo);
            
            if (!usersToDelete.isEmpty()) {
                userRepository.deleteAll(usersToDelete);
                log.info("Successfully deleted {} users and their related data.", usersToDelete.size());
            } else {
                log.info("No old deleted users found for cleanup.");
            }
        } catch (Exception e) {
            log.error("Error occurred during deleted user cleanup", e);
        }
    }
}
