import {Button, Input} from '@material-tailwind/react';

import {Product} from '@/types/product';

export type ProductViewMode = 'view' | 'manage' | 'admin';

interface ProductActionButtonsProps {
  mode?: ProductViewMode;
  product: Product | (Partial<Product> & { id: number });
  isAuction: boolean;
  isAuctionEnded: boolean;
  isHighestBidder: boolean;
  purchaseAmount: number | string;
  setPurchaseAmount: (value: number | string) => void;
  handleBid: () => void;
  handleBuyNow: () => void;
  handlePurchase: () => void;
  handleEndSale?: () => void;
}

const ProductActionButtons = ({
                                mode = 'view',
                                product,
                                isAuction,
                                isAuctionEnded,
                                isHighestBidder,
                                purchaseAmount,
                                setPurchaseAmount,
                                handleBid,
                                handleBuyNow,
                                handlePurchase,
                                handleEndSale,
                              }: ProductActionButtonsProps) => {

  //판매자용 액션
  if (mode === 'manage') {
    const canEnd = product.status === 'SELLING' || product.status === 'AUCTION' || product.status === 'FIXED_SALES';
    return (
        <div className='flex gap-3'>
          <Button
              fullWidth
              variant='gradient'
              color='red'
              className='h-12'
              onClick={handleEndSale}
              disabled={!canEnd || isAuctionEnded}
          >
            {isAuctionEnded ? '경매 마감됨' : '판매 종료하기'}
          </Button>
        </div>
    );
  }

  //관리자용 액션
  if (mode === 'admin') {
    return (
        <div className='flex gap-3'>
          <Button fullWidth variant='outlined' color='red' className='h-12'>
            관리자 권한: 상품 삭제
          </Button>
        </div>
    );
  }

  //일반 유저용 액션
  if (
      product.status !== 'SELLING' &&
      product.status !== 'AUCTION' &&
      product.status !== 'FIXED_SALES'
  ) {
    return (
        <Button fullWidth color='gray' variant='outlined' disabled className='h-12 text-lg'>
          판매가 종료된 상품입니다.
        </Button>
    );
  }

  if (isAuctionEnded) {
    return (
        <Button
            fullWidth
            color='red'
            variant='outlined'
            disabled
            className='h-12 text-lg font-bold border-2'
        >
          경매가 마감되었습니다 (판매 종료)
        </Button>
    );
  }

  if (isAuction) {
    return (
        <div className='flex flex-col md:flex-row gap-3'>
          <Button
              fullWidth
              variant='gradient'
              color={isHighestBidder ? 'gray' : 'blue'}
              className='h-14 text-lg flex-1 shadow-lg shadow-blue-200/50'
              onClick={handleBid}
              disabled={isHighestBidder}
          >
            <div className='flex flex-col items-center leading-tight'>
            <span className='text-xs font-bold opacity-80 uppercase'>
              {isHighestBidder
                  ? '현재 최고 입찰자입니다'
                  : `입찰하기 (+${Number(product.bidIncrement).toLocaleString()} ${
                      product.priceUnit
                  })`}
            </span>
              {!isHighestBidder && (
                  <span className='font-black'>
                {(
                    Number(product.currentPrice) + Number(product.bidIncrement)
                ).toLocaleString()}{' '}
                    {product.priceUnit}
              </span>
              )}
            </div>
          </Button>
          {product.instantPrice !== undefined && (
              <Button
                  fullWidth
                  variant='gradient'
                  color='green'
                  className='h-14 text-lg flex-1 shadow-lg shadow-green-200/50'
                  onClick={handleBuyNow}
              >
                <div className='flex flex-col items-center leading-tight'>
                  <span className='text-xs font-bold opacity-80 uppercase'>즉시 구매하기</span>
                  <span className='font-black'>
                {Number(product.instantPrice).toLocaleString()} {product.priceUnit}
              </span>
                </div>
              </Button>
          )}
        </div>
    );
  }

  return (
      <div className='flex gap-3 items-end'>
        <div className='flex-[3] min-w-[100px]'>
          <Input
              type='number'
              label='구매 수량'
              min={1}
              max={product.stock || 1}
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              className='!text-lg !font-bold text-center placeholder:text-blue-gray-200'
              containerProps={{className: 'min-w-0'}}
              crossOrigin=''
          />
        </div>
        <Button
            variant='gradient'
            color='blue'
            className='h-[44px] text-lg flex-[7] flex items-center justify-center leading-none'
            onClick={handlePurchase}
            disabled={(product.stock !== null && product.stock !== undefined && product.stock <= 0)}
        >
          {product.stock !== null && product.stock !== undefined && product.stock > 0
              ? '구매 요청'
              : '품절되었습니다'}
        </Button>
      </div>
  );
};

export default ProductActionButtons;
