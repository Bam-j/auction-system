package com.auction.backend.domain.bid.dto;

import com.auction.backend.domain.bid.entity.BidStatus;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.utils.SearchParamParser;
import lombok.Getter;

@Getter
public class BidSearchCondition {

    private final ProductCategory category;
    private final BidStatus status;
    private final String keyword;
    private final String searchType;

    private BidSearchCondition(ProductCategory category, BidStatus status, String keyword, String searchType) {
        this.category = category;
        this.status = status;
        this.keyword = keyword;
        this.searchType = searchType;
    }

    public static BidSearchCondition of(String category, String status, String keyword, String searchType) {
        ProductCategory parsedCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        BidStatus parsedStatus = SearchParamParser.parseEnum(BidStatus.class, status);
        String parsedKeyword = SearchParamParser.parseString(keyword);
        String parsedSearchType = SearchParamParser.parseString(searchType);

        return new BidSearchCondition(parsedCategory, parsedStatus, parsedKeyword, parsedSearchType);
    }
}