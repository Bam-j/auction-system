import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Chip,
} from '@material-tailwind/react';

import {Product} from '@/types/product';
import {getFullImageUrl} from '@/utils/imageUtils';

import defaultImage from '@/assets/images/general/grass_block.jpeg';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({product}: ProductCardProps) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SELLING':
      case 'FIXED_SALES':
        return {color: 'green' as const, text: '판매중'};
      case 'SOLD_OUT':
        return {color: 'blue-gray' as const, text: '품절'};
      case 'INSTANT_BUY':
        return {color: 'deep-orange' as const, text: '즉시구매완료'};
      case 'AUCTION':
      case 'BIDDING':
        return {color: 'blue' as const, text: '경매진행중'};
      case 'CLOSED':
        return {color: 'blue-gray' as const, text: '경매마감'};
      default:
        return {color: 'gray' as const, text: '대기'};
    }
  };

  const statusInfo = getStatusInfo(product.status);
  const currentStatus = product.status?.toString().toUpperCase();
  const isInstantBuy = currentStatus === 'INSTANT_BUY';

  return (
      <Card className='w-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer'>
        <CardHeader floated={false} className='h-40 overflow-hidden relative'>
          <img
              src={getFullImageUrl(product.imageUrl) || defaultImage}
              alt={product.title}
              className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-300'
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
          />
          <div className='absolute top-2 right-2'>
            <Chip
                size='sm'
                color={statusInfo.color}
                value={statusInfo.text}
                className='rounded-full px-2'
            />
          </div>
        </CardHeader>

        <CardBody className='p-4 text-center'>
          <Typography variant='h6' color='blue-gray' className='mb-1 truncate font-bold'>
            {product.title}
          </Typography>

          <div className='flex flex-col gap-1 items-center justify-center min-h-[60px]'>
            <Typography color='blue' className='font-black text-lg'>
              {product.type === 'AUCTION' ? (
                  <span className='flex flex-col items-center'>
                <span className='text-[10px] uppercase tracking-tighter opacity-70 leading-none'>
                  {isInstantBuy
                      ? '판매 방식'
                      : statusInfo.text === '경매마감' ||
                      statusInfo.text === '품절' ||
                      currentStatus === 'SOLD_OUT'
                          ? '낙찰가'
                          : '현재 최고가'}
                </span>
                    {isInstantBuy ? (
                        <span className='text-orange-700'>즉시 구매</span>
                    ) : (
                        <span>
                    {Number(product.price).toLocaleString()}{' '}
                          <span className='text-xs font-normal opacity-80'>
                      {product.priceUnit || '원'}
                    </span>
                  </span>
                    )}
              </span>
              ) : (
                  <span className='flex flex-col items-center'>
                <span className='text-[10px] uppercase tracking-tighter opacity-70 leading-none'>
                  판매 가격
                </span>
                <span>
                  {Number(product.price).toLocaleString()}{' '}
                  <span className='text-xs font-normal opacity-80'>
                    {product.priceUnit || '원'}
                  </span>
                </span>
              </span>
              )}
            </Typography>

            <div className='min-h-[15px]'>
              {product.type !== 'AUCTION' ? (
                  <Typography variant='small' className='text-[11px] text-blue-gray-500 font-medium'>
                    남은 수량: {product.stock != null ? `${product.stock}개` : '정보없음'}
                  </Typography>
              ) : (
                  product.endedAt && (
                      <Typography color='red' className='text-[10px] font-bold animate-pulse'>
                        마감: {new Date(product.endedAt).toLocaleDateString()}
                      </Typography>
                  )
              )}
            </div>
          </div>
        </CardBody>

        <CardFooter className='pt-0 pb-4 px-4 border-t border-gray-100 flex justify-between items-center mt-auto'>
          <Typography className='text-xs text-blue-700'>판매자: {product.seller}</Typography>
        </CardFooter>
      </Card>
  );
};

export default ProductCard;
