import {useState, useEffect} from 'react';

//절대 경로 모듈
import CommonTable from '@/components/ui/CommonTable';
import Pagination from '@/components/ui/Pagination';
import PriceTag from '@/components/ui/PriceTag';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CommonFilterBar from '@/components/ui/CommonFilterBar';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  CATEGORY_FILTER_CONFIG, PURCHASE_REQUEST_STATUS_FILTER_CONFIG, BUYER_SELLER_SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from '@/constants/filterOptions';
import {SortConfig} from '@/types/ui';

//auth 도메인 내부 api
import {getAllPurchaseRequests} from '../api/adminApi';

interface Purchase {
  id: number;
  sellerName: string;
  productName: string;
  buyerName: string;
  requestDate: string;
  price: number;
  priceUnit: string;
  quantity: number;
  status: string;
}

const TABLE_HEAD = ['ID', '판매자', '상품명', '구매자', '구매일', '구매금액', '구매량', '상태'];

const AdminPurchaseHistory: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: null});

  const fetchPurchases = async (params: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      const response = await getAllPurchaseRequests(params);
      setPurchases(response.data);
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(searchParams);
  }, [searchParams]);

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig({key, direction});
  };

  const getSortedPurchases = (): Purchase[] => {
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
        case '판매자':
          aValue = a.sellerName;
          bValue = b.sellerName;
          break;
        case '상품명':
          aValue = a.productName;
          bValue = b.productName;
          break;
        case '구매자':
          aValue = a.buyerName;
          bValue = b.buyerName;
          break;
        case '구매일':
          aValue = new Date(a.requestDate).getTime();
          bValue = new Date(b.requestDate).getTime();
          break;
        case '구매금액':
          aValue = a.price;
          bValue = b.price;
          break;
        case '구매량':
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

  const purchaseFilters = [
    CATEGORY_FILTER_CONFIG,
    PURCHASE_REQUEST_STATUS_FILTER_CONFIG,
    BUYER_SELLER_SEARCH_TYPE_FILTER_CONFIG
  ];

  const handleSearch = (searchData: Record<string, any>) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchPurchases(params);
  };

  return (
      <div className='flex flex-col gap-4 h-full'>
        <CommonFilterBar
            searchPlaceholder='상품명, 판매자 또는 요청자 검색'
            filterConfigs={purchaseFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <LoadingSpinner size='large'/>
            </div>
        ) : purchases.length === 0 ? (
            <EmptyState message='구매 요청 기록이 없습니다.'/>
        ) : (
            <CommonTable
                title='전체 구매 요청 기록'
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
              {sortedPurchases.map((p) => (
                  <tr key={p.id} className='border-b border-blue-gray-50 hover:bg-gray-50'>
                    <td className='p-4 text-gray-600'>{p.id}</td>
                    <td className='p-4 font-medium text-gray-700'>{p.sellerName}</td>
                    <td className='p-4 font-bold text-blue-gray-900'>{p.productName}</td>
                    <td className='p-4 font-medium text-blue-600'>{p.buyerName}</td>
                    <td className='p-4 text-gray-600'>{new Date(p.requestDate).toLocaleDateString()}</td>
                    <td className='p-4'>
                      <PriceTag price={p.price} unit={p.priceUnit}/>
                    </td>
                    <td className='p-4 text-gray-600'>{p.quantity}개</td>
                    <td className='p-4'>
                      <StatusBadge status={p.status}/>
                    </td>
                  </tr>
              ))}
            </CommonTable>
        )}
      </div>
  );
};

export default AdminPurchaseHistory;
