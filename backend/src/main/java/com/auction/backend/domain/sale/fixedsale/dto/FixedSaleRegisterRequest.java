package com.auction.backend.domain.sale.fixedsale.dto;

import com.auction.backend.global.enums.ProductCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class FixedSaleRegisterRequest {

    @NotBlank(message = "상품 이름은 필수입니다.")
    private String productName;

    private String description;

    private String imageUrl;

    @NotNull(message = "카테고리는 필수입니다.")
    private ProductCategory category;

    @NotBlank(message = "가격은 필수입니다.")
    private String price;

    @NotNull(message = "재고는 필수입니다.")
    @Min(value = 1, message = "재고는 최소 1개 이상이어야 합니다.")
    private Integer stock;

    private org.springframework.web.multipart.MultipartFile image;
}
