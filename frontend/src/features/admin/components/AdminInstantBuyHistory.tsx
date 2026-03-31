import {useState, useEffect} from 'react';

import {IconButton, Tooltip} from '@material-tailwind/react';
import {EyeIcon} from '@heroicons/react/24/outline';

//절대 경로 모듈
import CommonTable from '@/components/ui/CommonTable';
import Pagination from '@/components/ui/Pagination';
import PriceTag from '@/components/ui/PriceTag';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CommonFilterBar from '@/components/ui/CommonFilterBar';
import {getAllInstantBuyRequests} from '@/features/product/api/productApi';
import ProductDetailModal from '@/features/product/components/ProductDetailModal';
import {
  CATEGORY_FILTER_CONFIG, PURCHASE_REQUEST_STATUS_FILTER_CONFIG, ADMIN_SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from '@/constants/filterOptions';
import {SortConfig} from '@/types/ui';
import { Product } from '@/types/product';

interface InstantBuyRequest {
  id: number;
  productName: string;
  requesterNickname: string;
  sellerNickname: string;
  requestDate: string;
  price: number;
  priceUnit: string;
  status: string;
  productId: number;
}

const TABLE_HEAD = ['ID', '상품명', '요청자', '판매자', '요청일', '요청 금액', '상태', '상세'];

const AdminInstantBuyHistory: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [requests, setRequests] = useState<InstantBuyRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<(Partial<Product> & { id: number }) | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: null});

  const fetchAllInstantBuyHistory = async (params: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      const response = await getAllInstantBuyRequests(params);
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch all instant buy history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInstantBuyHistory(searchParams);
  }, []);

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
        case '판매자':
          aValue = a.sellerNickname;
          bValue = b.sellerNickname;
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

  const instantBuyFilters = [
    CATEGORY_FILTER_CONFIG,
    PURCHASE_REQUEST_STATUS_FILTER_CONFIG,
    ADMIN_SEARCH_TYPE_FILTER_CONFIG
  ];

  const handleSearch = (searchData: Record<string, any>) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchAllInstantBuyHistory(params);
  };

  const handleViewDetail = (item: InstantBuyRequest) => {
    setSelectedProduct({id: item.productId});
    setOpenDetail(true);
  };

  return (
      <div className='flex flex-col gap-4'>
        <CommonFilterBar
            searchPlaceholder='상품명, 요청자 또는 판매자 검색'
            filterConfigs={instantBuyFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <LoadingSpinner size='large'/>
            </div>
        ) : requests.length === 0 ? (
            <EmptyState message='즉시 구매 요청 기록이 없습니다.'/>
        ) : (
            <>
              <CommonTable
                  title='전체 즉시 구매 기록'
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
                {sortedRequests.map((item) => (
                    <tr key={item.id} className='border-b border-blue-gray-50 hover:bg-gray-50'>
                      <td className='p-4 text-gray-600 font-medium'>{item.id}</td>
                      <td className='p-4 font-bold text-blue-gray-900'>{item.productName}</td>
                      <td className='p-4 text-gray-900'>{item.requesterNickname}</td>
                      <td className='p-4 text-gray-900'>{item.sellerNickname}</td>
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
                ))}
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

export default AdminInstantBuyHistory;
