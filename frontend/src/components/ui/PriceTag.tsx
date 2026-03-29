import {FC} from 'react';

import {Typography} from '@material-tailwind/react';

interface PriceTagProps {
  price: number | string;
  unit?: string;
  className?: string;
}

const PriceTag: FC<PriceTagProps> = ({price, unit = '에메랄드', className = ''}) => {
  // 숫자인지 확인
  const isNumeric = !isNaN(parseFloat(price as string)) && isFinite(price as number);

  // 숫자인 경우에만 천단위 콤마 포맷팅 #,###
  const formattedPrice = isNumeric
      ? Number(price).toLocaleString()
      : price;

  return (
      <Typography
          variant='small'
          className={`font-medium flex items-center gap-1 ${className}`}
      >
        <span>{formattedPrice}</span>
        {/* 숫자인 경우에만 단위를 붙임. 문자열 형태 가격은 이미 단위가 문자열에 포함 */}
        {isNumeric && unit && (
            <span className='opacity-80 text-[0.85em] font-normal'>{unit}</span>
        )}
      </Typography>
  );
};

export default PriceTag;
