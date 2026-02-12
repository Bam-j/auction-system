import React, {useState, useEffect, useRef} from "react";
import {Typography, Button, Input, Chip} from "@material-tailwind/react";
import {CubeIcon, UserCircleIcon, CalendarDaysIcon} from "@heroicons/react/24/outline";
import defaultImage from "@/assets/images/general/grass_block.jpeg";
import CommonModal from "../../../components/ui/CommonModal";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";

const ProductDetailModal = ({open, handleOpen, product}) => {
  const contentRef = useRef(null);

  const [purchaseAmount, setPurchaseAmount] = useState(1);

  useEffect(() => {
    if (open && contentRef.current) {
      setTimeout(() => {
        contentRef.current.scrollTop = 0;
      }, 10);
    }
  }, [open]);

  if (!product) {
    return null;
  }

  const isAuction = product.type === "AUCTION";

  const handleBid = () => {
    const nextBidPrice = product.currentPrice + product.bidIncrement;
    alert(`${nextBidPrice.toLocaleString()}원에 입찰하시겠습니까?`);
  };

  const handleBuyNow = () => {
    alert(`${product.instantPrice.toLocaleString()}원에 즉시 구매하시겠습니까?`);
  };

  const handlePurchase = () => {
    alert(`${product.title} ${purchaseAmount}개를 구매 요청합니다.`);
  };

  return (
      <CommonModal
          open={open}
          handleOpen={handleOpen}
          title={product.title}
          size="lg"
      >
        <div ref={contentRef} className="flex flex-col gap-6 p-6 h-full max-h-[70vh] overflow-y-auto outline-none">
          <div tabIndex={0} className="w-0 h-0 overflow-hidden focus:outline-none"/>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <img
                  src={product.image || defaultImage}
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
                    unit={product.priceUnit || "원"}
                    className="text-2xl text-blue-600"
                />
                {isAuction && (
                    <Typography variant="small" className="text-gray-500 mt-1">
                      (현재 최고 입찰가)
                    </Typography>
                )}
              </div>

              <hr className="border-gray-200 my-1"/>

              <div className="grid grid-cols-2 gap-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5 text-gray-400"/>
                  <Typography className="font-medium">{product.seller}</Typography>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400"/>
                  <Typography>{product.date}</Typography>
                </div>
                {!isAuction && (
                    <div className="col-span-2 flex items-center gap-2">
                      <CubeIcon className="h-5 w-5 text-gray-400"/>
                      <Typography>남은 재고: <span
                          className="font-bold text-blue-gray-900">{product.stock} 개</span></Typography>
                    </div>
                )}
              </div>

              {isAuction && (
                  <div className="bg-blue-50 p-4 rounded-lg text-sm grid grid-cols-2 gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">시작가:</span>
                      <PriceTag price={product.startPrice} unit={product.priceUnit} className="font-medium"/>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">입찰 단위:</span>
                      <PriceTag price={product.bidIncrement} unit={product.priceUnit}
                                className="font-bold text-blue-600"/>
                    </div>
                    {product.instantPrice && (
                        <div className="flex justify-between col-span-2 border-t border-blue-100 pt-2">
                          <span className="text-gray-600">즉시 구매가:</span>
                          <PriceTag price={product.instantPrice} unit={product.priceUnit}
                                    className="font-bold text-green-600"/>
                        </div>
                    )}
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
            {product.status !== 'SELLING' && product.status !== 'AUCTION' ? (
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
                  <div className="flex-[3] min-w-[80px]">
                    <Input
                        type="number"
                        label="구매 수량"
                        min={1}
                        max={product.stock}
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                        className="!text-lg !font-bold text-right !pr-12 placeholder:text-blue-gray-200"
                        containerProps={{ className: "min-w-0" }}
                    />
                  </div>
                  <Button
                      variant="gradient" color="blue"
                      className="h-10 text-lg flex-[7]"
                      onClick={handlePurchase}
                      disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? "구매 요청" : "품절되었습니다"}
                  </Button>
                </div>
            )}
          </div>
        </div>
      </CommonModal>
  );
};

export default ProductDetailModal;
