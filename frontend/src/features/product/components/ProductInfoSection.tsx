import {ReactNode} from 'react';

import {Typography, Chip} from '@material-tailwind/react';
import {CubeIcon, UserCircleIcon, CalendarDaysIcon} from '@heroicons/react/24/outline';

//절대 경로 모듈
import StatusBadge from '@/components/ui/StatusBadge';
import PriceTag from '@/components/ui/PriceTag';
import {translateCategory} from '@/utils/categoryTranslations';
import {formatDate} from '@/utils/dateUtils';
import {Product} from '@/types/product';

interface ProductInfoSectionProps {
  product: Product | (Partial<Product> & { id: number });
  isAuction: boolean;
  isAuctionEnded: boolean;
  currentStatus: string;
  isHighestBidder: boolean;
}

//상품 상태 표시용
const InfoRow = ({icon, label, value, className = ''}: {
  icon: ReactNode,
  label: string,
  value: ReactNode,
  className?: string
}) => (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className='text-gray-500'>{icon}</span>
      <Typography className='font-bold flex items-center gap-1'>
        <span className='opacity-70 font-normal'>{label}:</span> {value}
      </Typography>
    </div>
);

//경매에서 사용되는 상세 가격 행
const AuctionPriceRow = ({label, price, unit, valueClassName = ''}: {
  label: string,
  price: number,
  unit?: string,
  valueClassName?: string
}) => (
    <div className='flex justify-between items-center'>
      <span className='text-blue-gray-800 font-medium'>{label}:</span>
      <PriceTag price={price} unit={unit} className={valueClassName}/>
    </div>
);

const ProductInfoSection = ({
                              product,
                              isAuction,
                              isAuctionEnded,
                              currentStatus,
                              isHighestBidder,
                            }: ProductInfoSectionProps) => {
  return (
      <div className='md:col-span-2 flex flex-col gap-4'>
        <div className='flex justify-between items-start'>
          <StatusBadge
              status={
                isAuctionEnded && currentStatus !== 'SOLD_OUT' && currentStatus !== 'INSTANT_BUY'
                    ? 'CLOSED'
                    : product.status || ''
              }
          />
          <Chip
              variant='ghost'
              color='blue-gray'
              size='sm'
              value={translateCategory(product.category || '') || '기타'}
              icon={<CubeIcon className='h-4 w-4'/>}
              className='rounded-full'
          />
        </div>

        <div className='bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 shadow-sm'>
          <Typography
              variant='small'
              color='blue'
              className='font-bold mb-1 uppercase tracking-wider opacity-80'
          >
            {product.status === 'INSTANT_BUY'
                ? '판매 방식'
                : isAuction ? '현재 최고 입찰가' : '판매 가격'}
          </Typography>
          <div className='flex items-baseline gap-2'>
            {product.status === 'INSTANT_BUY' ? (
                <Typography className='text-4xl text-orange-700 font-black drop-shadow-sm'>
                  즉시 구매
                </Typography>
            ) : (
                <PriceTag
                    price={product.price || 0}
                    unit={product.priceUnit}
                    className='text-4xl text-blue-700 font-black drop-shadow-sm'
                />
            )}
          </div>
        </div>

        <hr className='border-gray-200 my-1'/>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-blue-gray-900'>
          <InfoRow
              icon={<UserCircleIcon className='h-5 w-5'/>}
              label='판매자'
              value={product.seller}
          />
          <InfoRow
              icon={<CalendarDaysIcon className='h-5 w-5'/>}
              label='등록일'
              value={formatDate(product.createdAt)}
          />
          {!isAuction && (
              <InfoRow
                  icon={<CubeIcon className='h-5 w-5'/>}
                  label='남은 재고'
                  value={
                    <span className='text-blue-600'>
                {product.stock != null ? `${product.stock} 개` : '정보 없음'}
              </span>
                  }
                  className='sm:col-span-2'
              />
          )}
        </div>

        {isAuction && (
            <div className='bg-blue-50 p-4 rounded-lg text-sm flex flex-col gap-2'>
              <AuctionPriceRow label='시작가' price={product.startPrice || 0} unit={product.priceUnit}
                               valueClassName='font-medium text-gray-900'/>
              <AuctionPriceRow label='입찰 단위' price={product.bidIncrement || 0} unit={product.priceUnit}
                               valueClassName='font-bold text-blue-600'/>

              <div className='flex justify-between items-center border-t border-blue-100 pt-2'>
                <span className='text-blue-gray-800 font-medium'>현재 최고 입찰자:</span>
                <span className='font-bold text-blue-700'>
              {product.highestBidderNickname || '없음'}
                  {isHighestBidder && <span className='ml-1 text-xs text-blue-500'>(나)</span>}
            </span>
              </div>

              {product.instantPrice !== undefined && (
                  <AuctionPriceRow label='즉시 구매가' price={product.instantPrice} unit={product.priceUnit}
                                   valueClassName='font-bold text-green-600 border-t border-blue-100 pt-2'/>
              )}

              <div className='flex justify-between items-center border-t border-blue-100 pt-2'>
                <span className='text-blue-gray-800 font-medium'>마감 일시:</span>
                <span className='font-medium text-red-600'>{formatDate(product.endedAt)}</span>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductInfoSection;
