import {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

//절대 경로 모듈
import useAuthStore from '@/stores/useAuthStore';
import {successAlert, errorAlert, warningAlert, confirmAction} from '@/utils/swalUtils';
import {Product} from '@/types/product';

import {
  getProductDetail, bidAuction,
  purchaseInstantBuy, purchaseFixedSale,
  endSale
} from '../api/productApi';

interface UseProductDetailProps {
  initialProduct: (Partial<Product> & { id: number }) | null;
  open: boolean;
  handleOpen: () => void;
}

//상품 상세 창 전용 알림 커스텀 훅
export const useProductDetail = ({initialProduct, open, handleOpen}: UseProductDetailProps) => {
  const navigate = useNavigate();
  const {user} = useAuthStore();
  const [product, setProduct] = useState<Product | (Partial<Product> & { id: number }) | null>(initialProduct);
  const [purchaseAmount, setPurchaseAmount] = useState<number | string>(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!initialProduct?.id) return;

    setIsLoading(true);
    try {
      const response = await getProductDetail(initialProduct.id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product detail:', error);
      errorAlert('오류', '상품 정보를 불러올 수 없습니다.');
      handleOpen();
    } finally {
      setIsLoading(false);
    }
  }, [initialProduct?.id, handleOpen]);

  useEffect(() => {
    if (open && initialProduct?.id) {
      setPurchaseAmount(1);
      fetchDetail();
    }
  }, [open, initialProduct?.id, fetchDetail]);

  const checkAuth = useCallback(() => {
    if (!user) {
      warningAlert('로그인을 해주세요').then(() => {
        handleOpen();
        navigate('/login');
      });
      return false;
    }

    if (!user.isVerified) {
      warningAlert('인증이 필요합니다.', '이메일 인증을 완료한 후 이용하실 수 있습니다.');
      return false;
    }

    return true;
  }, [user, handleOpen, navigate]);

  const handleBid = async () => {
    if (!checkAuth() || !product || product.auctionId === undefined) return;

    const isOwner = user?.nickname === product.seller;
    const isHighestBidder = user?.id === product.highestBidderId;

    if (isOwner) {
      await warningAlert('알림', '자신의 상품에는 입찰할 수 없습니다.');
      return;
    }

    if (isHighestBidder) {
      await warningAlert('알림', '이미 현재 최고 입찰자입니다.');
      return;
    }

    const currentPrice = isNaN(product.currentPrice!) ? 0 : Number(product.currentPrice);
    const bidIncrement = isNaN(product.bidIncrement!) ? 0 : Number(product.bidIncrement);
    const nextBidPrice = currentPrice + bidIncrement;

    const result = await confirmAction({
      title: '입찰 확인',
      text: `${nextBidPrice.toLocaleString()}${product.priceUnit}에 입찰하시겠습니까?`,
      confirmButtonText: '입찰'
    });

    if (!result.isConfirmed) return;

    try {
      await bidAuction({
        productId: product.id,
        bidAmount: nextBidPrice
      });

      await successAlert('입찰 완료', '입찰이 정상적으로 처리되었습니다.');
      handleOpen();
    } catch (error: any) {
      console.error('Bid failed:', error);
      const errorMessage = error.response?.data?.message || '입찰 중 오류가 발생했습니다.';
      await errorAlert('오류', errorMessage);
    }
  };

  const handleBuyNow = async () => {
    if (!checkAuth() || !product || product.auctionId === undefined) return;

    if (user?.nickname === product.seller) {
      await warningAlert('알림', '자신의 상품에는 즉시 구매 요청을 할 수 없습니다.');
      return;
    }

    const price = product.instantPrice;
    const displayPrice = price !== undefined && !isNaN(price) && isFinite(price)
        ? Number(price).toLocaleString()
        : String(price);

    const result = await confirmAction({
      title: '즉시 구매 확인',
      text: `${displayPrice}${product.priceUnit}에 즉시 구매하시겠습니까?`,
      confirmButtonText: '구매',
      confirmButtonColor: '#10B981'
    });

    if (!result.isConfirmed) return;

    try {
      await purchaseInstantBuy({productId: product.id});
      await successAlert('구매 요청 완료', '즉시 구매 요청이 판매자에게 전달되었습니다.');
      handleOpen();
    } catch (error: any) {
      console.error('Instant purchase failed:', error);
      const errorMessage = error.response?.data?.message || '구매 중 오류가 발생했습니다.';
      await errorAlert('오류', errorMessage);
    }
  };

  const handlePurchase = async () => {
    if (!checkAuth() || !product || product.fixedSaleId === undefined) return;

    if (user?.nickname === product.seller) {
      await warningAlert('알림', '자신의 상품에는 구매 요청을 할 수 없습니다.');
      return;
    }

    if (product.stock !== null && product.stock !== undefined && Number(purchaseAmount) > product.stock) {
      await warningAlert('수량 오류', '재고를 초과하는 양을 요청할 수 없습니다.');
      return;
    }

    const result = await confirmAction({
      title: '구매 요청',
      text: `${product.title} ${purchaseAmount}개를 구매 요청하시겠습니까?`,
      confirmButtonText: '요청'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await purchaseFixedSale({
        productId: product.id,
        quantity: Number(purchaseAmount)
      });

      if (response.status === 200) {
        await successAlert('성공', '구매 요청이 성공적으로 전송되었습니다.');
        handleOpen();
      }
    } catch (error: any) {
      console.error('Purchase request failed:', error);
      const errorMessage = error.response?.data?.message || '구매 요청 중 오류가 발생했습니다.';
      await errorAlert('오류', errorMessage);
    }
  };

  const handleEndSaleClick = async () => {
    if (!product) return;

    const result = await confirmAction({
      title: '판매 종료 확인',
      text: '정말로 이 상품의 판매를 종료하시겠습니까? 종료 후에는 다시 활성화할 수 없습니다.',
      confirmButtonText: '판매 종료',
      confirmButtonColor: '#EF4444'
    });

    if (!result.isConfirmed) return;

    try {
      await endSale(product.id);
      await successAlert('종료 완료', '판매가 정상적으로 종료되었습니다.');
      handleOpen();
    } catch (error: any) {
      console.error('End sale failed:', error);
      const errorMessage = error.response?.data?.message || '판매 종료 중 오류가 발생했습니다.';
      await errorAlert('오류', errorMessage);
    }
  };

  return {
    product,
    isLoading,
    purchaseAmount,
    setPurchaseAmount,
    handleBid,
    handleBuyNow,
    handlePurchase,
    handleEndSale: handleEndSaleClick,
    user,
  };
};
