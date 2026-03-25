package com.auction.backend.domain.product.repository;

import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.global.enums.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, ProductRepositoryCustom {
    List<Product> findByUser(User user);

    @Query("SELECT p FROM Product p WHERE " +
            "(:category IS NULL OR p.category = :category) AND " +
            "(:status IS NULL OR p.salesStatus = :status) AND " +
            "(:keyword IS NULL OR " +
            "  (:searchType = 'productName' AND p.productName LIKE %:keyword%) OR " +
            "  (:searchType = 'seller' AND (p.user.username LIKE %:keyword% OR p.user.nickname LIKE %:keyword%)) OR " +
            "  (:searchType IS NULL AND (p.productName LIKE %:keyword% OR p.user.username LIKE %:keyword% OR p.user.nickname LIKE %:keyword%))" +
            ")")
    List<Product> findByFilters(
            @Param("category") ProductCategory category,
            @Param("status") SalesStatus status,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE p.user = :user AND " +
            "(:category IS NULL OR p.category = :category) AND " +
            "(:status IS NULL OR p.salesStatus = :status) AND " +
            "(:keyword IS NULL OR p.productName LIKE %:keyword%)")
    List<Product> findByUserWithFilters(
            @Param("user") User user,
            @Param("category") ProductCategory category,
            @Param("status") SalesStatus status,
            @Param("keyword") String keyword);
}
