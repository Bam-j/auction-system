import React, {useState, useEffect, useRef} from "react";
import {Typography, Button, Input, Chip} from "@material-tailwind/react";
import {CubeIcon, UserCircleIcon, CalendarDaysIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import defaultImage from "@/assets/images/general/grass_block.jpeg";
import CommonModal from "../../../components/ui/CommonModal";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import { purchaseFixedSale, getProductDetail } from "../api/productApi";

const ProductDetailModal = ({open, handleOpen, product: initialProduct}) => {
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

  const handleBid = async () => {
    const currentPrice = isNaN(product.currentPrice) ? 0 : Number(product.currentPrice);
    const bidIncrement = isNaN(product.bidIncrement) ? 0 : Number(product.bidIncrement);
    const nextBidPrice = currentPrice + bidIncrement;

    const result = await Swal.fire({
      title: "입찰 확인",
      text: `${nextBidPrice.toLocaleString()}원에 입찰하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "입찰",
      cancelButtonText: "취소",
      customClass: {
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg mx-2",
        cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg mx-2"
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      // TODO: Implement actual bid logic
      Swal.fire({
        title: "입찰 완료",
        text: "입찰이 정상적으로 처리되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
        customClass: {
          confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
        },
        buttonsStyling: false,
      });
    }
  };

  const handleBuyNow = async () => {
    const price = product.instantPrice;
    const displayPrice = !isNaN(parseFloat(price)) && isFinite(price) 
      ? Number(price).toLocaleString() 
      : price;

    const result = await Swal.fire({
      title: "즉시 구매 확인",
      text: `${displayPrice}에 즉시 구매하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "구매",
      cancelButtonText: "취소",
      customClass: {
        confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg mx-2",
        cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg mx-2"
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      // TODO: Implement actual instant buy logic
      Swal.fire({
        title: "구매 완료",
        text: "구매가 정상적으로 처리되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
        customClass: {
          confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
        },
        buttonsStyling: false,
      });
    }
  };

  const handlePurchase = async () => {
    if (parseInt(purchaseAmount) > product.stock) {
      Swal.fire({
        title: "수량 오류",
        text: "재고를 초과하는 양을 요청할 수 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
        customClass: {
          confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
        },
        buttonsStyling: false,
      });
      return;
    }

    const result = await Swal.fire({
      title: "구매 요청",
      text: `${product.title} ${purchaseAmount}개를 구매 요청하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "요청",
      cancelButtonText: "취소",
      customClass: {
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg mx-2",
        cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg mx-2"
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await purchaseFixedSale({
        fixedSaleId: product.id,
        quantity: parseInt(purchaseAmount)
      });
      
      if (response.status === 200) {
        await Swal.fire({
          title: "성공",
          text: "구매 요청이 성공적으로 전송되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          customClass: {
            confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          },
          buttonsStyling: false,
        });
        handleOpen();
      }
    } catch (error) {
      console.error("Purchase request failed:", error);
      const errorMessage = error.response?.data?.message || "구매 요청 중 오류가 발생했습니다.";
      Swal.fire({
        title: "오류",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "확인",
        customClass: {
          confirmButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
        },
        buttonsStyling: false,
      });
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
              <Typography>정보를 불러오는 중입니다...</Typography>
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
                      src={product.imageUrl || product.image || defaultImage}
                      alt={product.title}
                      className="w-full h-64 md:h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <StatusBadge status={product.status}/>
                    <Chip
                        variant="ghost"
                        color="blue-gray"
                        size="sm"
                        value={product.category || "기타"}
                        icon={<CubeIcon className="h-4 w-4"/>}
                        className="rounded-full"
                    />
                  </div>

                  <div>
                    <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                      {product.title}
                    </Typography>
                    <PriceTag
                        price={isAuction ? product.currentPrice : product.price}
                        unit={product.priceUnit}
                        className="text-2xl text-blue-600"
                    />
                    {isAuction && (
                        <Typography variant="small" className="text-gray-500 mt-1">
                          (현재 최고 입찰가)
                        </Typography>
                    )}
                  </div>

                  <hr className="border-gray-200 my-1"/>

                  <div className="grid grid-cols-2 gap-y-3 text-blue-gray-900">
                    <div className="flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5 text-gray-500"/>
                      <Typography className="font-bold">{product.seller}</Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-500"/>
                      <Typography className="font-bold">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}</Typography>
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
                          <PriceTag price={product.startPrice} unit={product.priceUnit} className="font-medium"/>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-gray-800 font-medium">입찰 단위:</span>
                          <PriceTag price={product.bidIncrement} unit={product.priceUnit}
                                    className="font-bold text-blue-600"/>
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
                            {product.endedAt ? new Date(product.endedAt).toLocaleString() : "-"}
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
                ) : isAuction ? (
                    <div className="flex flex-col md:flex-row gap-3">
                      <Button
                          fullWidth
                          variant="gradient" color="blue" className="h-12 text-lg flex-1"
                          onClick={handleBid}
                      >
                        입찰하기 (+<PriceTag price={product.bidIncrement} unit="" className="inline"/>)
                      </Button>
                      {product.instantPrice && (
                          <Button
                              fullWidth
                              variant="gradient" color="green" className="h-12 text-lg flex-1"
                              onClick={handleBuyNow}
                          >
                            즉시 구매 (<PriceTag price={product.instantPrice} unit="" className="inline"/>)
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
                            containerProps={{ className: "min-w-0" }}
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
