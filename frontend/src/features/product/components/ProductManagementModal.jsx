import React from "react";
import { Typography, Button, Chip } from "@material-tailwind/react";
import { UserCircleIcon, CalendarDaysIcon, TagIcon, CubeIcon } from "@heroicons/react/24/outline";
import CommonModal from "../../../components/ui/CommonModal";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";

const ProductManagementModal = ({ open, handleOpen, product }) => {
  if (!product) return null;

  const isAuction = product.type === "AUCTION";

  return (
      <CommonModal
          open={open}
          handleOpen={handleOpen}
          title="상품 상세 정보 확인"
          size="lg"
          footer={
            <div className="flex w-full justify-end">
              <Button variant="gradient" color="blue-gray" onClick={handleOpen}>
                닫기
              </Button>
            </div>
          }
      >
        <div className="flex flex-col gap-6 p-2">
          <div className="flex flex-col md:flex-row gap-6">

            <div className="w-full md:w-1/3 shrink-0">
              <img
                  src={product.image || "https://placehold.co/400x400?text=No+Image"}
                  alt={product.title}
                  className="w-full h-64 md:h-full object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <StatusBadge status={product.status} />
                <Typography variant="small" className="text-gray-400">ID: {product.id}</Typography>
              </div>

              {/* 상품명 */}
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {product.title}
              </Typography>

              <hr className="border-gray-200" />

              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-500">판매자:</span>
                  <span className="font-bold">{product.seller}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-500">등록일:</span>
                  <span>{product.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-500">분류:</span>
                  <Chip value={product.category || "기타"} size="sm" variant="ghost" color="blue" className="rounded-full px-2 py-0.5" />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-auto border border-gray-100">
                {isAuction ? (
                    // [경매 상품일 경우]
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs">시작 가격</span>
                        <PriceTag price={product.startPrice} unit={product.priceUnit} className="font-medium" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs">입찰 단위</span>
                        <PriceTag price={product.bidIncrement} unit={product.priceUnit} className="font-bold text-blue-600" />
                      </div>
                      {product.instantPrice && (
                          <div className="col-span-2 flex flex-col mt-2 pt-2 border-t border-gray-200">
                            <span className="text-gray-500 text-xs">즉시 구매가</span>
                            <PriceTag price={product.instantPrice} unit={product.priceUnit} className="font-bold text-green-600 text-lg" />
                          </div>
                      )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs mb-1">판매 가격</span>
                        <PriceTag price={product.price} unit={product.priceUnit} className="text-xl text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs mb-1">남은 재고</span>
                        <div className="flex items-center gap-1 font-bold text-gray-800">
                          <CubeIcon className="h-4 w-4" />
                          {product.stock}개
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Typography variant="small" className="font-bold text-gray-900 mb-2 block">
              상품 부가 설명
            </Typography>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[100px]">
              <Typography variant="small" className="text-gray-700 whitespace-pre-wrap font-normal">
                {product.description || "등록된 상세 설명이 없습니다."}
              </Typography>
            </div>
          </div>
        </div>
      </CommonModal>
  );
};

export default ProductManagementModal;