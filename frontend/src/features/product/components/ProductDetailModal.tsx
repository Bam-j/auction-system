import {useRef, useEffect} from 'react';
import {Typography} from '@material-tailwind/react';

//절대 경로 모듈
import CommonModal from '@/components/ui/CommonModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {Product} from '@/types/product';

//도메인 내부 모듈
import ProductImageGallery from './details/ProductImageGallery';
import ProductInfoSection from './details/ProductInfoSection';
import ProductDescription from './details/ProductDescription';
import ProductActionButtons, {ProductViewMode} from './details/ProductActionButtons';
import {useProductDetail} from '../hooks/useProductDetail';

interface ProductDetailModalProps {
  open: boolean;
  handleOpen: () => void;
  product: (Partial<Product> & { id: number }) | null;
  mode?: ProductViewMode;
}

const ProductDetailModal = ({
                              open,
                              handleOpen,
                              product: initialProduct,
                              mode = 'view'
                            }: ProductDetailModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    product,
    isLoading,
    purchaseAmount,
    setPurchaseAmount,
    handleBid,
    handleBuyNow,
    handlePurchase,
    handleEndSale,
    user,
  } = useProductDetail({initialProduct, open, handleOpen});

  // 스크롤 초기화 로직만 유지
  useEffect(() => {
    if (open && contentRef.current) {
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 10);
    }
  }, [open]);

  if (!product && !isLoading) {
    return null;
  }

  const isAuction = product?.type === 'AUCTION';
  const currentStatus = product?.status?.toString().toUpperCase() || '';
  const isAuctionEnded = !!(isAuction && product?.endedAt && new Date(product.endedAt) < new Date());
  const isHighestBidder = !!(user && product?.highestBidderId === user.id);

  return (
      <CommonModal
          open={open}
          handleOpen={handleOpen}
          title={product?.title || '상품 상세'}
          size='lg'
      >
        <div ref={contentRef} className='flex flex-col gap-6 p-6 h-full max-h-[70vh] overflow-y-auto outline-none'>
          {isLoading ? (
              <div className='flex justify-center items-center h-64'>
                <LoadingSpinner size='medium'/>
              </div>
          ) : !product ? (
              <div className='text-center p-10'>
                <Typography color='red'>상품 정보를 불러올 수 없습니다.</Typography>
              </div>
          ) : (
              <>
                <div tabIndex={0} className='w-0 h-0 overflow-hidden focus:outline-none'/>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <ProductImageGallery imageUrl={product.imageUrl} title={product.title}/>

                  <ProductInfoSection
                      product={product}
                      isAuction={isAuction}
                      isAuctionEnded={isAuctionEnded}
                      currentStatus={currentStatus}
                      isHighestBidder={isHighestBidder}
                  />
                </div>

                <hr className='border-border'/>

                <ProductDescription description={product.description}/>

                <div className='mt-4'>
                  <ProductActionButtons
                      mode={mode}
                      product={product}
                      isAuction={isAuction}
                      isAuctionEnded={isAuctionEnded}
                      isHighestBidder={isHighestBidder}
                      purchaseAmount={purchaseAmount}
                      setPurchaseAmount={setPurchaseAmount}
                      handleBid={handleBid}
                      handleBuyNow={handleBuyNow}
                      handlePurchase={handlePurchase}
                      handleEndSale={handleEndSale}
                  />
                </div>
              </>
          )}
        </div>
      </CommonModal>
  );
};

export default ProductDetailModal;
