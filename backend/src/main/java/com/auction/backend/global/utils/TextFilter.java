package com.auction.backend.global.utils;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
public class TextFilter {

    private final Set<String> reservedWords = new HashSet<>();
    private final Set<String> badWordsEn = new HashSet<>();
    private final Set<String> badWordsKo = new HashSet<>();

    @PostConstruct
    public void init() {
        loadDictionary("dict/reserved_words.txt", reservedWords);
        loadDictionary("dict/badwords_en.txt", badWordsEn);
        loadDictionary("dict/badwords_ko.txt", badWordsKo);
        log.info("필터링 사전 로드 완료 - 예약어:{}개, 영문욕설:{}개, 한글욕설:{}개",
                reservedWords.size(), badWordsEn.size(), badWordsKo.size());
    }

    private void loadDictionary(String filePath, Set<String> targetSet) {
        try {
            ClassPathResource resource = new ClassPathResource(filePath);
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
            String line;
            while ((line = reader.readLine()) != null) {
                String word = line.trim();
                if (!word.isEmpty() && !word.startsWith("#")) {
                    targetSet.add(word.toLowerCase());
                }
            }
        } catch (Exception e) {
            log.warn("'{}' 파일을 찾을 수 없거나 읽기 실패했습니다.", filePath);
        }
    }

    public void validateUsernameOrNickname(String text) {
        if (text == null || text.isBlank()) return;

        String pureText = text.toLowerCase().replaceAll("[^a-z0-9]", "");

        for (String reserved : reservedWords) {
            if (pureText.contains(reserved)) {
                throw new IllegalArgumentException("시스템 예약어는 아이디나 닉네임으로 사용할 수 없습니다.");
            }
        }

        for (String badWord : badWordsEn) {
            if (pureText.contains(badWord)) {
                throw new IllegalArgumentException("부적절한 단어가 포함되어 있습니다.");
            }
        }
    }

    public void validateProductText(String text) {
        if (text == null || text.isBlank()) return;

        String pureText = text.toLowerCase().replaceAll("[^a-z0-9가-힣]", "");

        for (String badWord : badWordsEn) {
            if (pureText.contains(badWord)) {
                throw new IllegalArgumentException("상품명에 부적절한 영문이 포함되어 있습니다.");
            }
        }

        for (String badWord : badWordsKo) {
            if (pureText.contains(badWord)) {
                throw new IllegalArgumentException("상품명에 부적절한 한글이 포함되어 있습니다.");
            }
        }
    }
}
