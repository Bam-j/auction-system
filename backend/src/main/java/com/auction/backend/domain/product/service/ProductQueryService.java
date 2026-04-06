package com.auction.backend.domain.product.service;

import com.auction.backend.domain.bid.service.BidQueryService;
import com.auction.backend.domain.product.dto.ProductListResponse;
import com.auction.backend.domain.product.entity.Product;
import com.auction.backend.domain.product.entity.SalesStatus;
import com.auction.backend.domain.product.repository.ProductRepository;
import com.auction.backend.domain.sale.auction.service.AuctionQueryService;
import com.auction.backend.domain.sale.fixedsale.service.FixedSaleQueryService;
import com.auction.backend.domain.user.entity.User;
import com.auction.backend.domain.user.service.UserQueryService;
import com.auction.backend.global.enums.PriceUnit;
import com.auction.backend.global.enums.ProductCategory;
import com.auction.backend.global.exception.common.ResourceNotFoundException;
import com.auction.backend.global.utils.SearchParamParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductQueryService {

    private final ProductRepository productRepository;
    private final FixedSaleQueryService fixedSaleQueryService;
    private final AuctionQueryService auctionQueryService;
    private final UserQueryService userQueryService;
    private final BidQueryService bidQueryService;

    //모든 상품 조회
    public List<ProductListResponse> getAllProducts(String category, String status, String searchType, String keyword) {
        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        SalesStatus salesStatus = SearchParamParser.parseEnum(SalesStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);
        String stype = SearchParamParser.parseString(searchType);

        return productRepository.findByFiltersWithQueryDSL(productCategory, salesStatus, stype, searchKeyword);
    }

    //특정 유저의 등록 상품 조회
    public List<ProductListResponse> getUserProducts(Long userId, String category, String status, String keyword) {
        User user = userQueryService.getUser(userId);

        ProductCategory productCategory = SearchParamParser.parseEnum(ProductCategory.class, category);
        SalesStatus salesStatus = SearchParamParser.parseEnum(SalesStatus.class, status);
        String searchKeyword = SearchParamParser.parseString(keyword);

        return productRepository.findByUserWithFiltersWithQueryDSL(user, productCategory, salesStatus, searchKeyword);
    }

    //상품 상세 정보 조회
    public ProductListResponse getProductDetail(Long productId) {
        return productRepository.findProductDetailWithQueryDSL(productId);
    }

    //상품 획득
    public Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));
    }

    private ProductListResponse convertToResponse(Product product) {
        String type = "FIXED";
        String price = "0";
        String priceUnit = "에메랄드";
        Integer stock = null;
        LocalDateTime endedAt = null;
        Integer startPrice = null;
        Integer currentPrice = null;
        Integer bidIncrement = null;
        String instantPrice = null;
        Long auctionId = null;
        Long fixedSaleId = null;
        String highestBidderNickname = null;
        Long highestBidderId = null;

        var fixedSaleOpt = fixedSaleQueryService.getFixedSaleByProduct(product);
        if (fixedSaleOpt.isPresent()) {
            var fixedSale = fixedSaleOpt.get();
            price = fixedSale.getPrice();
            type = "FIXED";
            priceUnit = "에메랄드";
            stock = fixedSale.getStock();
            fixedSaleId = fixedSale.getFixedSaleId();
        } else {
            var auctionOpt = auctionQueryService.getAuctionByProduct(product);
            if (auctionOpt.isPresent()) {
                var auction = auctionOpt.get();
                type = "AUCTION";
                priceUnit = PriceUnit.getDisplayName(auction.getPriceUnit());
                endedAt = auction.getEndedAt();
                startPrice = auction.getStartPrice();
                currentPrice = auction.getCurrentPrice();
                bidIncrement = auction.getMinBidIncrement();
                instantPrice = auction.getInstantPurchasePrice() != null ? String.valueOf(auction.getInstantPurchasePrice()) : null;
                auctionId = auction.getAuctionId();

                //즉시 구매 완료된 경우 가격을 즉시 구매가로 설정
                if (product.getSalesStatus() == SalesStatus.INSTANT_BUY && instantPrice != null) {
                    price = instantPrice;
                } else {
                    price = String.valueOf(auction.getCurrentPrice());
                }

                //최고 입찰자 정보 추가
                var highestBidOpt = bidQueryService.getHighestBid(auction);
                if (highestBidOpt.isPresent()) {
                    var highestBid = highestBidOpt.get();
                    highestBidderNickname = highestBid.getUser().getNickname();
                    highestBidderId = highestBid.getUser().getUserId();
                }
            }
        }

        return ProductListResponse.builder()
                .id(product.getProductId())
                .auctionId(auctionId)
                .fixedSaleId(fixedSaleId)
                .title(product.getProductName())
                .seller(product.getUser().getNickname())
                .price(price)
                .priceUnit(priceUnit)
                .imageUrl(product.getImageUrl())
                .status(product.getSalesStatus())
                .type(type)
                .category(product.getCategory())
                .description(product.getDescription())
                .stock(stock)
                .createdAt(product.getCreatedAt())
                .endedAt(endedAt)
                .startPrice(startPrice)
                .currentPrice(currentPrice)
                .bidIncrement(bidIncrement)
                .instantPrice(instantPrice)
                .highestBidderNickname(highestBidderNickname)
                .highestBidderId(highestBidderId)
                .build();
    }
}
