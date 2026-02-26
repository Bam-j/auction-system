package com.auction.backend.domain.sale.auction.dto;

import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AuctionRegisterRequest {

    @NotBlank(message = "상품 이름은 필수입니다.")
    private String productName;

    //상품 상세 설명은 선택
    private String description;

    @NotNull(message = "카테고리는 필수입니다.")
    private ProductCategory category;

    @NotNull(message = "경매 종료 시간은 필수입니다.")
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime endedAt;

    @NotNull(message = "시작가는 필수입니다.")
    @Min(value = 0, message = "시작가는 0 이상이어야 합니다.")
    private Integer startPrice;

    @NotNull(message = "최소 입찰 단위는 필수입니다.")
    @Min(value = 1, message = "최소 입찰 단위는 1 이상이어야 합니다.")
    private Integer minBidIncrement;

    private String instantPurchasePrice;

    @NotNull(message = "가격 단위는 필수입니다.")
    private PriceUnit priceUnit;

    private MultipartFile image;
}
