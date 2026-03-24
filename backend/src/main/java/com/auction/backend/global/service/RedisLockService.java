package com.auction.backend.global.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

//동시성 제어를 위한 Redis 분산 락 서비스
@Slf4j
@Service
@RequiredArgsConstructor
public class RedisLockService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String LOCK_PREFIX = "lock:";
    private static final long DEFAULT_WAIT_TIME = 3000;
    private static final long DEFAULT_LEASE_TIME = 5000;

    //분산 락을 이용한 작업 수행
    public <T> T runWithLock(String lockKey, Supplier<T> action) {
        String fullKey = LOCK_PREFIX + lockKey;
        long startTime = System.currentTimeMillis();

        try {
            while (System.currentTimeMillis() - startTime < DEFAULT_WAIT_TIME) {
                Boolean acquired = redisTemplate.opsForValue().setIfAbsent(fullKey, "locked", Duration.ofMillis(DEFAULT_LEASE_TIME));
                
                if (Boolean.TRUE.equals(acquired)) {
                    try {
                        return action.get();
                    } finally {
                        redisTemplate.delete(fullKey);
                    }
                }

                TimeUnit.MILLISECONDS.sleep(100);
            }
            throw new RuntimeException("락 획득에 실패했습니다: " + fullKey);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("락 획득 중 인터럽트가 발생했습니다", e);
        }
    }
}
