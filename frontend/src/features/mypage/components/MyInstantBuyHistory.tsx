import {useState, useEffect} from 'react';

import {Button, IconButton, Tooltip} from '@material-tailwind/react';
import {CheckIcon, XMarkIcon, EyeIcon} from '@heroicons/react/24/outline';
import {successAlert, errorAlert, infoAlert, confirmAction, confirmDanger} from '@/utils/swalUtils';

//절대 경로 모듈
import CommonTable from '@/components/ui/CommonTable';
import Pagination from '@/components/ui/Pagination';
import PriceTag from '@/components/ui/PriceTag';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CommonFilterBar from '@/components/ui/CommonFilterBar';
import ProductDetailModal from '@/features/product/components/ProductDetailModal';
import {approveInstantBuy, rejectInstantBuy} from '@/features/product/api/productApi';
import useAuthStore from '@/stores/useAuthStore';
import {
  CATEGORY_FILTER_CONFIG, PURCHASE_REQUEST_STATUS_FILTER_CONFIG, SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from '@/constants/filterOptions';
import {SortConfig} from '@/types/ui';
import { Product } from '@/types/product';

//도메인 내부 api
import {getMyInstantBuyRequests} from '../api/mypageApi';

interface InstantBuyRequest {
  id: number;
  productName: string;
  requesterNickname: string;
  requestDate: string;
  price: number;
  priceUnit: string;
  status: string;
  productId: number;
}

const TABLE_HEAD = ['ID', '상품명', '요청자', '요청일', '요청 금액', '상태', '수락', '상세'];

const MyInstantBuyHistory: React.FC = () => {
  const {user} = useAuthStore();
  const [page, setPage] = useState<number>(1);
  const [requests, setRequests] = useState<InstantBuyRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<(Partial<Product> & { id: number }) | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: null});

  const fetchInstantBuyHistory = async (params: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      const response = await getMyInstantBuyRequests(params);
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch instant buy history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstantBuyHistory(searchParams);
  }, [searchParams]);

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig({key, direction});
  };

  const getSortedRequests = (): InstantBuyRequest[] => {
    if (!sortConfig.key || !sortConfig.direction) {
      return requests;
    }

    return [...requests].sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortConfig.key) {
        case 'ID':
          aValue = a.id;
          bValue = b.id;
          break;
        case '상품명':
          aValue = a.productName;
          bValue = b.productName;
          break;
        case '요청자':
          aValue = a.requesterNickname;
          bValue = b.requesterNickname;
          break;
        case '요청일':
          aValue = new Date(a.requestDate).getTime();
          bValue = new Date(b.requestDate).getTime();
          break;
        case '요청 금액':
          aValue = a.price;
          bValue = b.price;
          break;
        case '상태':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedRequests = getSortedRequests();

  const filterConfigs = [
    CATEGORY_FILTER_CONFIG,
    PURCHASE_REQUEST_STATUS_FILTER_CONFIG,
    {
      ...SEARCH_TYPE_FILTER_CONFIG,
      options: [
        {label: '전체', value: 'ALL'},
        {label: '상품명', value: 'productName'},
        {label: '판매자', value: 'nickname'},
      ],
    }
  ];

  const handleSearch = (searchData: Record<string, any>) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchInstantBuyHistory(params);
  };

  const handleApprove = async (id: number) => {
    const result = await confirmAction({
      title: '요청 수락',
      text: '이 즉시 구매 요청을 수락하시겠습니까?',
      confirmButtonText: '수락',
      confirmButtonColor: '#10B981'
    });

    if (result.isConfirmed) {
      try {
        await approveInstantBuy(id);
        await fetchInstantBuyHistory(searchParams);
        successAlert('수락 완료', '요청이 수락되었습니다.');
      } catch (error: any) {
        errorAlert('오류', error.response?.data?.message || '처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleReject = async (id: number) => {
    const result = await confirmDanger(
        '요청 거절',
        '이 즉시 구매 요청을 거절하시겠습니까?',
        '거절'
    );

    if (result.isConfirmed) {
      try {
        await rejectInstantBuy(id);
        await fetchInstantBuyHistory(searchParams);
        infoAlert('거절 완료', '요청이 거절되었습니다.');
      } catch (error: any) {
        errorAlert('오류', error.response?.data?.message || '처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleViewDetail = (item: InstantBuyRequest) => {
    setSelectedProduct({id: item.productId});
    setOpenDetail(true);
  };

  return (
      <div className='flex flex-col gap-4 h-full'>
        <CommonFilterBar
            searchPlaceholder='상품명 또는 판매자 닉네임 검색'
            filterConfigs={filterConfigs}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <LoadingSpinner size='large'/>
            </div>
        ) : requests.length === 0 ? (
            <EmptyState message='즉시 구매 요청 내역이 없습니다.'/>
        ) : (
            <>
              <CommonTable
                  title='즉시 구매 요청 기록'
                  headers={TABLE_HEAD}
                  onSort={handleSort}
                  currentSort={sortConfig}
                  pagination={
                    <Pagination
                        active={page}
                        total={Math.ceil(requests.length / 10) || 1}
                        onChange={setPage}
                    />
                  }
              >
                {sortedRequests.map((item) => {
                  const isRequester = item.requesterNickname === user?.nickname;
                  return (
                      <tr key={item.id} className='border-b border-blue-gray-50 hover:bg-gray-50'>
                        <td className='p-4 text-gray-600'>{item.id}</td>
                        <td className='p-4 font-bold text-blue-gray-900'>{item.productName}</td>
                        <td className='p-4'>
                          <div className='flex flex-col'>
                      <span className={`text-sm ${isRequester ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                        {item.requesterNickname}
                      </span>
                            {isRequester && <span className='text-[10px] text-blue-400 font-normal'>(본인)</span>}
                          </div>
                        </td>
                        <td className='p-4 text-gray-600 text-sm'>
                          {new Date(item.requestDate).toLocaleDateString()}
                        </td>
                        <td className='p-4'>
                          <PriceTag price={item.price} unit={item.priceUnit}/>
                        </td>
                        <td className='p-4'>
                          <StatusBadge status={item.status}/>
                        </td>
                        <td className='p-4'>
                          <div className='flex gap-2'>
                            <Tooltip content={isRequester ? '본인 요청은 수락할 수 없습니다' : '수락'}>
                              <IconButton
                                  size='sm'
                                  variant='gradient'
                                  color='green'
                                  disabled={isRequester || item.status !== 'PENDING'}
                                  onClick={() => handleApprove(item.id)}
                              >
                                <CheckIcon className='h-4 w-4'/>
                              </IconButton>
                            </Tooltip>
                            {!isRequester && item.status === 'PENDING' && (
                                <Tooltip content='거절'>
                                  <IconButton
                                      size='sm'
                                      variant='outlined'
                                      color='red'
                                      onClick={() => handleReject(item.id)}
                                  >
                                    <XMarkIcon className='h-4 w-4'/>
                                  </IconButton>
                                </Tooltip>
                            )}
                          </div>
                        </td>
                        <td className='p-4'>
                          <Tooltip content='상세 보기'>
                            <IconButton
                                size='sm'
                                variant='text'
                                color='blue-gray'
                                onClick={() => handleViewDetail(item)}
                            >
                              <EyeIcon className='h-4 w-4'/>
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                  );
                })}
              </CommonTable>

              <ProductDetailModal
                  open={openDetail}
                  handleOpen={() => setOpenDetail(!openDetail)}
                  product={selectedProduct}
              />
            </>
        )}
      </div>
  );
};

export default MyInstantBuyHistory;
