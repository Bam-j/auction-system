import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

import {Typography, Button, Input, Chip} from "@material-tailwind/react";
import {CubeIcon, UserCircleIcon, CalendarDaysIcon} from "@heroicons/react/24/outline";

//절대 경로 모듈
import CommonModal from "@/components/ui/CommonModal";
import StatusBadge from "@/components/ui/StatusBadge.jsx";
import PriceTag from "@/components/ui/PriceTag";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useAuthStore from "@/stores/useAuthStore";
import {translateCategory} from "@/utils/categoryTranslations.js";
import {successAlert, errorAlert, warningAlert, confirmAction} from "@/utils/swalUtils.js";
import {getFullImageUrl} from "@/utils/imageUtils.js";

//product 도메인 내부 api
import {purchaseFixedSale, getProductDetail, bidAuction, purchaseInstantBuy} from "../api/productApi";

//에셋
import defaultImage from "@/assets/images/general/grass_block.jpeg";

const ProductDetailModal = ({open, handleOpen, product: initialProduct}) => {
  const navigate = useNavigate();
  const {user} = useAuthStore();
  const contentRef = useRef(null);
  const [product, setProduct] = useState(initialProduct);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && initialProduct?.id) {
      setPurchaseAmount(1);
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const response = await getProductDetail(initialProduct.id);
          setProduct(response.data);
        } catch (error) {
          console.error("Failed to fetch product detail:", error);
          errorAlert("오류", "상품 정보를 불러올 수 없습니다.");
          handleOpen();
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();

      if (contentRef.current) {
        setTimeout(() => {
          contentRef.current.scrollTop = 0;
        }, 10);
      }
    }
  }, [open, initialProduct]);

  if (!product && !isLoading) {
    return null;
  }

  const isAuction = product?.type === "AUCTION";
  const currentStatus = product?.status?.toString().toUpperCase();

  // 경매 마감 여부 확인
  const isAuctionEnded = isAuction && product?.endedAt && new Date(product.endedAt) < new Date();

  const isOwner = user && product?.seller === user.nickname;
  const isHighestBidder = user && product?.highestBidderId === user.id;

  const checkAuth = () => {
    if (!user) {
      warningAlert("로그인을 해주세요").then(() => {
        handleOpen();
        navigate("/login");
      });
      return false;
    }
    
    if (!user.isVerified) {
      warningAlert("인증이 필요합니다.", "이메일 인증을 완료한 후 이용하실 수 있습니다.");
      return false;
    }
    
    return true;
  };

  const handleBid = async () => {
    if (!checkAuth()) {
      return;
    }

    if (isOwner) {
      await warningAlert("알림", "자신의 상품에는 입찰할 수 없습니다.");
      return;
    }

    if (isHighestBidder) {
      await warningAlert("알림", "이미 현재 최고 입찰자입니다.");
      return;
    }

    const currentPrice = isNaN(product.currentPrice) ? 0 : Number(product.currentPrice);
    const bidIncrement = isNaN(product.bidIncrement) ? 0 : Number(product.bidIncrement);
    const nextBidPrice = currentPrice + bidIncrement;

    const result = await confirmAction({
      title: "입찰 확인",
      text: `${nextBidPrice.toLocaleString()}${product.priceUnit}에 입찰하시겠습니까?`,
      confirmButtonText: "입찰"
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await bidAuction({
        auctionId: product.auctionId,
        bidPrice: nextBidPrice
      });

      await successAlert("입찰 완료", "입찰이 정상적으로 처리되었습니다.");
      handleOpen();
    } catch (error) {
      console.error("Bid failed:", error);
      const errorMessage = error.response?.data?.message || "입찰 중 오류가 발생했습니다.";
      await errorAlert("오류", errorMessage);
    }
  };

  const handleBuyNow = async () => {
    if (!checkAuth()) {
      return;
    }

    if (isOwner) {
      await warningAlert("알림", "자신의 상품에는 즉시 구매 요청을 할 수 없습니다.");
      return;
    }

    const price = product.instantPrice;
    const displayPrice = !isNaN(parseFloat(price)) && isFinite(price)
        ? Number(price).toLocaleString()
        : price;

    const result = await confirmAction({
      title: "즉시 구매 확인",
      text: `${displayPrice}${product.priceUnit}에 즉시 구매하시겠습니까?`,
      confirmButtonText: "구매",
      confirmButtonColor: "#10B981"
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await purchaseInstantBuy({
        auctionId: product.auctionId
      });

      await successAlert("구매 요청 완료", "즉시 구매 요청이 판매자에게 전달되었습니다.");
      handleOpen();
    } catch (error) {
      console.error("Instant purchase failed:", error);
      const errorMessage = error.response?.data?.message || "구매 중 오류가 발생했습니다.";
      await errorAlert("오류", errorMessage);
    }
  };

  const handlePurchase = async () => {
    if (!checkAuth()) {
      return;
    }

    if (isOwner) {
      await warningAlert("알림", "자신의 상품에는 구매 요청을 할 수 없습니다.");
      return;
    }

    if (parseInt(purchaseAmount) > product.stock) {
      await warningAlert("수량 오류", "재고를 초과하는 양을 요청할 수 없습니다.");
      return;
    }

    const result = await confirmAction({
      title: "구매 요청",
      text: `${product.title} ${purchaseAmount}개를 구매 요청하시겠습니까?`,
      confirmButtonText: "요청"
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await purchaseFixedSale({
        fixedSaleId: product.fixedSaleId,
        quantity: parseInt(purchaseAmount)
      });

      if (response.status === 200) {
        await successAlert("성공", "구매 요청이 성공적으로 전송되었습니다.");
        handleOpen();
      }
    } catch (error) {
      console.error("Purchase request failed:", error);
      const errorMessage = error.response?.data?.message || "구매 요청 중 오류가 발생했습니다.";
      await errorAlert("오류", errorMessage);
    }
  };

  return (
      <CommonModal
          open={open}
          handleOpen={handleOpen}
          title={product?.title || "상품 상세"}
          size="lg"
      >
        <div ref={contentRef} className="flex flex-col gap-6 p-6 h-full max-h-[70vh] overflow-y-auto outline-none">
          {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="medium"/>
              </div>
          ) : !product ? (
              <div className="text-center p-10">
                <Typography color="red">상품 정보를 불러올 수 없습니다.</Typography>
              </div>
          ) : (
              <>
                <div tabIndex={0} className="w-0 h-0 overflow-hidden focus:outline-none"/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img
                        src={getFullImageUrl(product.imageUrl) || defaultImage}
                        alt={product.title}
                        className="w-full h-64 md:h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <StatusBadge
                          status={isAuctionEnded && currentStatus !== 'SOLD_OUT' && currentStatus !== 'INSTANT_BUY' ? 'CLOSED' : product.status}/>
                      <Chip
                          variant="ghost"
                          color="blue-gray"
                          size="sm"
                          value={translateCategory(product.category) || "기타"}
                          icon={<CubeIcon className="h-4 w-4"/>}
                          className="rounded-full"
                      />
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 shadow-sm">
                      <Typography variant="small" color="blue"
                                  className="font-bold mb-1 uppercase tracking-wider opacity-80">
                        {product.status === "INSTANT_BUY" ? "판매 방식" : (isAuction ? "현재 최고 입찰가" : "판매 가격")}
                      </Typography>
                      <div className="flex items-baseline gap-2">
                        {product.status === "INSTANT_BUY" ? (
                            <Typography className="text-4xl text-orange-700 font-black drop-shadow-sm">
                              즉시 구매
                            </Typography>
                        ) : (
                            <PriceTag
                                price={product.price}
                                unit={product.priceUnit}
                                className="text-4xl text-blue-700 font-black drop-shadow-sm"
                            />
                        )}
                      </div>
                    </div>

                    <hr className="border-gray-200 my-1"/>

                    <div className="grid grid-cols-2 gap-y-3 text-blue-gray-900">
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="h-5 w-5 text-gray-500"/>
                        <Typography className="font-bold">판매자: {product.seller}</Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-500"/>
                        <Typography className="font-bold">
                          등록일:
                          {product.createdAt ? new Date(product.createdAt).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : "-"}
                        </Typography>
                      </div>
                      {!isAuction && (
                          <div className="col-span-2 flex items-center gap-2">
                            <CubeIcon className="h-5 w-5 text-gray-500"/>
                            <Typography className="font-medium">남은 재고: <span
                                className="font-bold text-blue-600">{product.stock != null ? `${product.stock} 개` : "정보 없음"}</span></Typography>
                          </div>
                      )}
                    </div>

                    {isAuction && (
                        <div className="bg-blue-50 p-4 rounded-lg text-sm grid grid-cols-2 gap-2">
                          <div className="flex justify-between">
                            <span className="text-blue-gray-800 font-medium">시작가:</span>
                            <PriceTag price={product.startPrice} unit={product.priceUnit}
                                      className="font-medium text-gray-900"/>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-gray-800 font-medium">입찰 단위:</span>
                            <PriceTag price={product.bidIncrement} unit={product.priceUnit}
                                      className="font-bold text-blue-600"/>
                          </div>
                          <div className="flex justify-between col-span-2 border-t border-blue-100 pt-2">
                            <span className="text-blue-gray-800 font-medium">현재 최고 입찰자:</span>
                            <span className="font-bold text-blue-700">
                              {product.highestBidderNickname || "없음"}
                              {isHighestBidder && <span className="ml-1 text-xs text-blue-500">(나)</span>}
                            </span>
                          </div>
                          {product.instantPrice && (
                              <div className="flex justify-between col-span-2 border-t border-blue-100 pt-2">
                                <span className="text-blue-gray-800 font-medium">즉시 구매가:</span>
                                <PriceTag price={product.instantPrice} unit={product.priceUnit}
                                          className="font-bold text-green-600"/>
                              </div>
                          )}
                          <div className="flex justify-between col-span-2 border-t border-blue-100 pt-2">
                            <span className="text-blue-gray-800 font-medium">마감 일시:</span>
                            <span className="font-medium text-red-600">
                            {product.endedAt ? new Date(product.endedAt).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : "-"}
                          </span>
                          </div>
                        </div>
                    )}
                  </div>
                </div>

                <hr className="border-gray-200"/>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-3">
                    상품 부가 설명
                  </Typography>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[120px]">
                    <Typography className="text-gray-700 whitespace-pre-line font-normal">
                      {product.description || "등록된 설명이 없습니다."}
                    </Typography>
                  </div>
                </div>

                <div className="mt-4">
                  {product.status !== 'SELLING' && product.status !== 'AUCTION' && product.status !== 'FIXED_SALES' ? (
                      <Button fullWidth color="gray" variant="outlined" disabled className="h-12 text-lg">
                        판매가 종료된 상품입니다.
                      </Button>
                  ) : isAuctionEnded ? (
                      <Button fullWidth color="red" variant="outlined" disabled
                              className="h-12 text-lg font-bold border-2">
                        경매가 마감되었습니다 (판매 종료)
                      </Button>
                  ) : isAuction ? (
                      <div className="flex flex-col md:flex-row gap-3">
                        <Button
                            fullWidth
                            variant="gradient" color={isHighestBidder ? "gray" : "blue"}
                            className="h-14 text-lg flex-1 shadow-lg shadow-blue-200/50"
                            onClick={handleBid}
                            disabled={isHighestBidder}
                        >
                          <div className="flex flex-col items-center leading-tight">
                            <span
                                className="text-xs font-bold opacity-80 uppercase">
                              {isHighestBidder ? "현재 최고 입찰자입니다" : `입찰하기 (+${Number(product.bidIncrement).toLocaleString()} ${product.priceUnit})`}
                            </span>
                            {!isHighestBidder && (
                                <span
                                    className="font-black">{(Number(product.currentPrice) + Number(product.bidIncrement)).toLocaleString()} {product.priceUnit}</span>
                            )}
                          </div>
                        </Button>
                        {product.instantPrice && (
                            <Button
                                fullWidth
                                variant="gradient" color="green"
                                className="h-14 text-lg flex-1 shadow-lg shadow-green-200/50"
                                onClick={handleBuyNow}
                            >
                              <div className="flex flex-col items-center leading-tight">
                                <span className="text-xs font-bold opacity-80 uppercase">즉시 구매하기</span>
                                <span
                                    className="font-black">{Number(product.instantPrice).toLocaleString()} {product.priceUnit}</span>
                              </div>
                            </Button>
                        )}
                      </div>
                  ) : (
                      <div className="flex gap-3 items-end">
                        <div className="flex-[3] min-w-[100px]">
                          <Input
                              type="number"
                              label="구매 수량"
                              min={1}
                              max={product.stock}
                              value={purchaseAmount}
                              onChange={(e) => setPurchaseAmount(e.target.value)}
                              className="!text-lg !font-bold text-center placeholder:text-blue-gray-200"
                              containerProps={{className: "min-w-0"}}
                          />
                        </div>
                        <Button
                            variant="gradient" color="blue"
                            className="h-[44px] text-lg flex-[7] flex items-center justify-center leading-none"
                            onClick={handlePurchase}
                            disabled={product.stock <= 0}
                        >
                          {product.stock > 0 ? "구매 요청" : "품절되었습니다"}
                        </Button>
                      </div>
                  )}
                </div>
              </>
          )}
        </div>
      </CommonModal>
  );
};

export default ProductDetailModal;
