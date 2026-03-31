import {useState, useEffect} from 'react';

import {Card, CardHeader, CardBody, CardFooter, Typography, Button} from '@material-tailwind/react';

//절대 경로 모듈
import PriceTag from '@/components/ui/PriceTag';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProductDetailModal from '@/features/product/components/ProductDetailModal';
import CommonFilterBar from '@/components/ui/CommonFilterBar';
import {getProducts} from '@/features/product/api/productApi';
import {getFullImageUrl} from '@/utils/imageUtils';
import {
  CATEGORY_FILTER_CONFIG, SALE_METHOD_FILTER_CONFIG, SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from '@/constants/filterOptions';
import {Product, SearchParams} from '@/types/product';

//에셋
import defaultImage from '@/assets/images/general/grass_block.jpeg';

const HomePage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<(Partial<Product> & { id: number }) | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const fetchProducts = async (params: SearchParams = {}) => {
    setIsLoading(true);
    try {
      const response = await getProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchParams);
  }, []);

  const productListFilters = [
    CATEGORY_FILTER_CONFIG,
    SEARCH_TYPE_FILTER_CONFIG,
    SALE_METHOD_FILTER_CONFIG
  ];

  const handleSearch = (searchData: any) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    fetchProducts(params);
  };

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  return (
      <div className='max-w-screen-xl mx-auto p-6 min-h-screen'>
        <div className='flex flex-col mb-6 gap-4'>
          <CommonFilterBar
              searchPlaceholder='검색어 입력'
              filterConfigs={productListFilters}
              onSearch={handleSearch}
          />
        </div>

        {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <LoadingSpinner size='large'/>
            </div>
        ) : products.length === 0 ? (
            <EmptyState message='등록된 상품이 없습니다.'/>
        ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {products.map((product) => {
                const currentStatus = product.status?.toString().toUpperCase();
                const isInstantBuy = currentStatus === 'INSTANT_BUY';
                const isAuctionEnded = !!(product.type === 'AUCTION' && product.endedAt && new Date(product.endedAt) < new Date());
                const isSoldOut = (currentStatus === 'SOLD_OUT' || isInstantBuy || isAuctionEnded);

                return (
                    <Card key={product.id} onClick={() => handleCardClick(product)}
                          className={`w-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
                      <CardHeader floated={false} color='blue-gray' className={`relative h-42 m-0 rounded-b-none`}>
                        <img
                            src={getFullImageUrl(product.imageUrl) || defaultImage}
                            alt={product.title}
                            className='w-full h-full object-cover'
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              (e.target as HTMLImageElement).src = defaultImage;
                            }}
                        />
                        <div className='absolute top-2 right-2 z-10'>
                          <StatusBadge
                              status={isAuctionEnded && currentStatus !== 'SOLD_OUT' && currentStatus !== 'INSTANT_BUY' ? 'CLOSED' : product.status}/>
                        </div>
                      </CardHeader>

                      <CardBody className='p-4'>
                        <div className='flex justify-between items-start mb-2'>
                          <Typography variant='small' className='font-bold text-font-main'>
                            {product.type === 'AUCTION' ? '경매' : '일반 판매'}
                          </Typography>
                          <Typography variant='small' className='font-normal text-font-dark_blue'>
                            판매자: <strong> {product.seller} </strong>
                          </Typography>
                        </div>
                        <Typography variant='h6' color='blue-gray' className='mb-1 truncate'>
                          {product.title}
                        </Typography>

                        <div className='min-h-[70px] flex flex-col justify-between'>
                          <div className='flex flex-col'>
                            <Typography variant='small' className='text-[10px] text-gray-500 font-bold mb-0.5'>
                              {product.type === 'AUCTION'
                                  ? (isInstantBuy ? '판매 방식' : (isAuctionEnded || currentStatus === 'SOLD_OUT' ? '낙찰가' : '현재 최고가'))
                                  : '판매 가격'
                              }
                            </Typography>
                            {isInstantBuy ? (
                                <Typography className='text-lg font-bold text-orange-700'>
                                  즉시 구매
                                </Typography>
                            ) : (
                                <PriceTag
                                    price={product.price}
                                    unit={product.priceUnit}
                                    className='text-lg text-font-dark_blue'
                                />
                            )}
                          </div>

                          {product.type === 'AUCTION' && product.endedAt ? (
                              <Typography variant='small' className='text-[10px] text-red-500 font-medium'>
                                마감: {new Date(product.endedAt).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              </Typography>
                          ) : (
                              <Typography variant='small' className='text-[11px] text-blue-gray-500 font-medium'>
                                남은 수량: {product.stock != null ? `${product.stock}개` : '정보없음'}
                              </Typography>
                          )}
                        </div>
                      </CardBody>

                      <CardFooter className='pt-0 px-4 pb-4'>
                        <Button
                            fullWidth
                            variant={isSoldOut ? 'outlined' : 'gradient'}
                            color={isSoldOut ? 'gray' : 'blue'}
                            disabled={isSoldOut}
                        >
                          {isSoldOut ? '판매 종료' : '상세 보기'}
                        </Button>
                      </CardFooter>
                    </Card>
                )
              })}
            </div>
        )}
        <ProductDetailModal
            open={openModal}
            handleOpen={() => setOpenModal(!openModal)}
            product={selectedProduct}
        />
      </div>
  );
};

export default HomePage;
