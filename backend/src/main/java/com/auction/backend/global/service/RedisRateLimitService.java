package com.auction.backend.global.service;

import com.auction.backend.global.exception.common.TooManyRequestsException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisRateLimitService {

    private final StringRedisTemplate redisTemplate;

    //특정 키에 대한 요청 횟수 체크 및 제한 초과 시 예외 throw
    public void checkRateLimit(String key, int limit, int seconds) {
        Long count = redisTemplate.opsForValue().increment(key);

        if (count != null && count == 1) {
            // 처음 요청 시 만료 시간 설정
            redisTemplate.expire(key, Duration.ofSeconds(seconds));
        }

        if (count != null && count > limit) {
            throw new TooManyRequestsException("요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.");
        }
    }
}
