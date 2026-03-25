package com.auction.backend.domain.user.repository;

import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);

    boolean existsByNickname(String nickname);

    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE " +
            "(:keyword IS NULL OR u.username LIKE %:keyword% OR u.nickname LIKE %:keyword%) AND " +
            "(:status IS NULL OR u.status = :status)")
    List<User> findByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") UserStatus status);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByStatusAndUpdatedAtBefore(UserStatus status, java.time.LocalDateTime dateTime);

    java.util.List<User> findByStatusAndUpdatedAtBefore(UserStatus status, java.time.LocalDateTime dateTime);
}
