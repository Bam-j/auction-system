import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import {Button, Typography, IconButton, Tooltip} from '@material-tailwind/react';
import {EyeIcon, CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {successAlert, errorAlert, confirmAction} from '@/utils/swalUtils';

//절대 경로 모듈
import CommonTable from '@/components/ui/CommonTable';
import Pagination from '@/components/ui/Pagination';
import PriceTag from '@/components/ui/PriceTag';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import CommonFilterBar from '@/components/ui/CommonFilterBar';
import ProductManagementModal from '@/features/product/components/ProductManagementModal';
import {
  getIncomingPurchaseRequests, approvePurchaseRequest, rejectPurchaseRequest
} from '@/features/product/api/productApi';
import {
  CATEGORY_FILTER_CONFIG,
  PURCHASE_REQUEST_STATUS_FILTER_CONFIG,
  MY_SALES_SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from '@/constants/filterOptions';
import {SortConfig} from '@/types/ui';

interface IncomingRequest {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  priceUnit: string;
  status: string;
  requestDate: string;
  productId: number;
}

const TABLE_HEAD = ['ID', '상품명', '수량', '가격', '상태', '요청 일시', '상세', '관리'];

const MySalesRequests: React.FC = () => {
  const location = useLocation();
  const [page, setPage] = useState<number>(1);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number } | null>(null);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: null});

  const fetchIncomingRequests = async (params: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      const response = await getIncomingPurchaseRequests(params);
      setRequests(response.data);

      if (location.state?.openProductId) {
        setSelectedProduct({id: location.state.openProductId});
        setOpenDetail(true);
      }
    } catch (error) {
      console.error('Failed to fetch incoming requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests(searchParams);
  }, [location.state, searchParams]);

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig({key, direction});
  };

  const getSortedRequests = (): IncomingRequest[] => {
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
        case '수량':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case '가격':
          aValue = a.price;
          bValue = b.price;
          break;
        case '상태':
          aValue = a.status;
          bValue = b.status;
          break;
        case '요청 일시':
          aValue = new Date(a.requestDate).getTime();
          bValue = new Date(b.requestDate).getTime();
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
    MY_SALES_SEARCH_TYPE_FILTER_CONFIG
  ];

  const handleSearch = (searchData: Record<string, any>) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchIncomingRequests(params);
  };

  const handleViewDetail = (item: IncomingRequest) => {
    setSelectedProduct({id: item.productId});
    setOpenDetail(true);
  };

  const handleAction = async (id: number, action: 'ACCEPT' | 'REJECT') => {
    const isAccept = action === 'ACCEPT';
    const actionText = isAccept ? '수락' : '거절';

    const result = await confirmAction({
      title: `요청 ${actionText}`,
      text: `정말로 이 요청을 ${actionText}하시겠습니까?`,
      icon: 'question',
      confirmButtonText: actionText,
      confirmButtonColor: isAccept ? '#10B981' : '#EF4444'
    });

    if (result.isConfirmed) {
      try {
        if (isAccept) {
          await approvePurchaseRequest(id);
        } else {
          await rejectPurchaseRequest(id);
        }

        await fetchIncomingRequests();

        successAlert('처리 완료', `요청이 ${actionText}되었습니다.`);
      } catch (error: any) {
        console.error(`Failed to ${action} purchase request:`, error);
        errorAlert('처리 실패', error.response?.data?.message || '요청 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
      <div className='flex flex-col gap-4 h-full'>
        <CommonFilterBar
            searchPlaceholder='상품명 검색'
            filterConfigs={filterConfigs}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <LoadingSpinner size='large'/>
            </div>
        ) : requests.length === 0 ? (
            <EmptyState message='들어온 구매 요청이 없습니다.'/>
        ) : (
            <>
              <CommonTable
                  title='들어온 구매 요청'
                  headers={TABLE_HEAD}
                  onSort={handleSort}
                  currentSort={sortConfig}
                  pagination={
                      requests.length > 0 && (
                          <Pagination
                              active={page}
                              total={Math.ceil(requests.length / 10) || 1}
                              onChange={setPage}
                          />
                      )
                  }
              >
                {sortedRequests.map((req) => (
                    <tr key={req.id} className='border-b border-blue-gray-50 hover:bg-gray-50'>
                      <td className='p-4 text-gray-600'>{req.id}</td>
                      <td className='p-4 font-bold text-blue-gray-900'>{req.productName}</td>
                      <td className='p-4 text-gray-600'>{req.quantity}개</td>
                      <td className='p-4'>
                        <PriceTag
                            price={req.price}
                            unit={req.priceUnit}
                        />
                      </td>
                      <td className='p-4'>
                        <StatusBadge status={req.status}/>
                      </td>
                      <td className='p-4 text-gray-600'>
                        {new Date(req.requestDate).toLocaleDateString()}
                      </td>

                      <td className='p-4'>
                        <Tooltip content='상품 상세 보기'>
                          <IconButton size='sm' variant='text' color='blue-gray' onClick={() => handleViewDetail(req)}>
                            <EyeIcon className='h-4 w-4'/>
                          </IconButton>
                        </Tooltip>
                      </td>

                      <td className='p-4 flex gap-2'>
                        {req.status === 'PENDING' ? (
                            <>
                              <Tooltip content='요청 수락'>
                                <IconButton
                                    size='sm' variant='gradient' color='green'
                                    onClick={() => handleAction(req.id, 'ACCEPT')}
                                >
                                  <CheckIcon className='h-4 w-4'/>
                                </IconButton>
                              </Tooltip>
                              <Tooltip content='요청 거절'>
                                <IconButton
                                    size='sm' variant='outlined' color='red'
                                    onClick={() => handleAction(req.id, 'REJECT')}
                                >
                                  <XMarkIcon className='h-4 w-4'/>
                                </IconButton>
                              </Tooltip>
                            </>
                        ) : (
                            <Typography variant='small' color='gray'>처리완료</Typography>
                        )}
                      </td>
                    </tr>
                ))}
              </CommonTable>

              <ProductManagementModal
                  open={openDetail}
                  handleOpen={() => setOpenDetail(!openDetail)}
                  product={selectedProduct}
              />
            </>
        )}
      </div>
  );
};

export default MySalesRequests;
