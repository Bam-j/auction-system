import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import {IconButton, Tooltip} from '@material-tailwind/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {successAlert, errorAlert, confirmDanger} from '@/utils/swalUtils';

//절대 경로 모듈
import CommonTable from '@/components/ui/CommonTable';
import Pagination from '@/components/ui/Pagination';
import PriceTag from '@/components/ui/PriceTag';
import TableActionButtons from '@/components/ui/TableActionButtons';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CommonFilterBar from '@/components/ui/CommonFilterBar';
import StatusBadge from '@/components/ui/StatusBadge';
import {getMyPurchaseRequests, cancelPurchaseRequest} from '@/features/product/api/productApi';
import ProductDetailModal from '@/features/product/components/ProductDetailModal';
import {
  CATEGORY_FILTER_CONFIG, PURCHASE_REQUEST_STATUS_FILTER_CONFIG, SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from '@/constants/filterOptions';
import {SortConfig} from '@/types/ui';
import {Product} from '@/types/product';

interface PurchaseRequest {
  id: number;
  productName: string;
  requestDate: string;
  price: number;
  priceUnit: string;
  quantity: number;
  status: string;
  productId: number;
}

const TABLE_HEAD = ['ID', '상품명', '요청일', '가격', '수량', '상태', '상세', '관리'];

const MyPurchaseHistory: React.FC = () => {
  const location = useLocation();
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<(Partial<Product> & { id: number }) | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: null});

  const fetchPurchaseHistory = async (params: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      const response = await getMyPurchaseRequests(params);
      setPurchases(response.data);

      if (location.state?.openProductId) {
        setSelectedProduct({id: location.state.openProductId});
        setOpenModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory(searchParams);
  }, [location.state, searchParams]);

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig({key, direction});
  };

  const getSortedPurchases = (): PurchaseRequest[] => {
    if (!sortConfig.key || !sortConfig.direction) {
      return purchases;
    }

    return [...purchases].sort((a, b) => {
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
        case '요청일':
          aValue = new Date(a.requestDate).getTime();
          bValue = new Date(b.requestDate).getTime();
          break;
        case '가격':
          aValue = a.price;
          bValue = b.price;
          break;
        case '수량':
          aValue = a.quantity;
          bValue = b.quantity;
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

  const sortedPurchases = getSortedPurchases();

  const filterConfigs = [
    CATEGORY_FILTER_CONFIG,
    PURCHASE_REQUEST_STATUS_FILTER_CONFIG,
    {
      ...SEARCH_TYPE_FILTER_CONFIG,
      options: [
        {label: '전체', value: 'ALL'},
        {label: '상품명', value: 'productName'},
        {label: '판매자', value: 'seller'},
      ],
    }
  ];

  const handleSearch = (searchData: Record<string, any>) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchPurchaseHistory(params);
  };

  const handleCancel = async (id: number) => {
    const result = await confirmDanger(
        '요청 취소',
        '정말로 이 구매 요청을 취소하시겠습니까?',
        '취소하기'
    );

    if (result.isConfirmed) {
      try {
        await cancelPurchaseRequest(id);
        await fetchPurchaseHistory();
        successAlert('취소 완료', '구매 요청이 성공적으로 취소되었습니다.');
      } catch (error: any) {
        console.error('Failed to cancel purchase request:', error);
        errorAlert('취소 실패', error.response?.data?.message || '요청 취소 중 오류가 발생했습니다.');
      }
    }
  };

  const handleViewDetail = (item: PurchaseRequest) => {
    setSelectedProduct({id: item.productId});
    setOpenModal(true);
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
        ) : purchases.length === 0 ? (
            <EmptyState message='구매 내역이 없습니다.'/>
        ) : (
            <>
              <CommonTable
                  title='내 구매 기록'
                  headers={TABLE_HEAD}
                  onSort={handleSort}
                  currentSort={sortConfig}
                  pagination={
                      purchases.length > 0 && (
                          <Pagination
                              active={page}
                              total={Math.ceil(purchases.length / 10) || 1}
                              onChange={setPage}
                          />
                      )
                  }
              >
                {sortedPurchases.map((item) => (
                    <tr key={item.id} className='border-b border-blue-gray-50 hover:bg-gray-50'>
                      <td className='p-4 text-gray-600'>{item.id}</td>
                      <td className='p-4 font-bold text-blue-gray-900'>{item.productName}</td>
                      <td className='p-4 text-gray-600'>
                        {new Date(item.requestDate).toLocaleDateString()}
                      </td>
                      <td className='p-4'>
                        <PriceTag
                            price={item.price}
                            unit={item.priceUnit}
                        />
                      </td>
                      <td className='p-4 text-gray-600'>{item.quantity}개</td>
                      <td className='p-4'>
                        <StatusBadge status={item.status}/>
                      </td>
                      <td className='p-4'>
                        <TableActionButtons onView={() => handleViewDetail(item)}/>
                      </td>
                      <td className='p-4'>
                        {item.status === 'PENDING' && (
                            <Tooltip content='요청 취소'>
                              <IconButton
                                  size='sm' variant='outlined' color='red'
                                  onClick={() => handleCancel(item.id)}
                              >
                                <XMarkIcon className='h-4 w-4'/>
                              </IconButton>
                            </Tooltip>
                        )}
                      </td>
                    </tr>
                ))}
              </CommonTable>

              <ProductDetailModal
                  open={openModal}
                  handleOpen={() => setOpenModal(!openModal)}
                  product={selectedProduct}
              />
            </>
        )}
      </div>
  );
};

export default MyPurchaseHistory;
