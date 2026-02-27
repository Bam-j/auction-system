import React from "react";
import {Typography} from "@material-tailwind/react";

const PriceTag = ({price, unit = "원", className = ""}) => {
  // 숫자인지 확인
  const isNumeric = !isNaN(parseFloat(price)) && isFinite(price);
  
  // 숫자인 경우에만 천단위 콤마 포맷팅
  const formattedPrice = isNumeric 
    ? Number(price).toLocaleString() 
    : price;

  return (
      <Typography
          variant="small"
          className={`font-medium text-gray-900 flex items-center gap-1 ${className}`}
      >
        {formattedPrice}
        {/* 숫자인 경우에만 단위를 붙임 (문자열 가격은 이미 단위가 포함되어 있을 확률이 높음) */}
        {isNumeric && unit && (
          <span className="text-gray-500 text-xs">{unit}</span>
        )}
      </Typography>
  );
};

export default PriceTag;