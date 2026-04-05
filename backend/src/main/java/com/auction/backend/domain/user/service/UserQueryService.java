package com.auction.backend.domain.user.service;

import com.auction.backend.domain.user.dto.profile.UserResponse;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import com.auction.backend.domain.user.repository.UserRepository;
import com.auction.backend.global.exception.ResourceNotFoundException;
import com.auction.backend.global.utils.SearchParamParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQueryService {

    private final UserRepository userRepository;

    //시스템에 등록된 모든 회원 조회
    public List<UserResponse> getAllUsers(String keyword, String status) {
        UserStatus userStatus = SearchParamParser.parseEnum(UserStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);

        return userRepository.findByKeywordAndStatus(searchKeyword, userStatus).stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    //회원 획득
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
    }

    //회원 정보 응답 획득
    public UserResponse getUserResponse(Long userId) {
        return UserResponse.from(getUser(userId));
    }
}
