import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

//절대 경로 모듈
import CommonTable from '@/components/ui/CommonTable';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/ui/StatusBadge';
import PriceTag from '@/components/ui/PriceTag';
import TableActionButtons from '@/components/ui/TableActionButtons';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CommonFilterBar from '@/components/ui/CommonFilterBar';
import ProductDetailModal from '@/features/product/components/ProductDetailModal';
import {getMyBids} from '@/features/product/api/productApi';
import {
  CATEGORY_FILTER_CONFIG, BID_STATUS_FILTER_CONFIG, SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from '@/constants/filterOptions';
import {SortConfig} from '@/types/ui';
import { Product } from '@/types/product';

interface Bid {
  id: number;
  productName: string;
  bidDate: string;
  bidPrice: number;
  priceUnit: string;
  status: string;
  productId: number;
}

const TABLE_HEAD = ['ID', '상품명', '입찰일', '입찰금액', '결과', '상세'];

const MyBidHistory: React.FC = () => {
  const location = useLocation();
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<(Partial<Product> & { id: number }) | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: '', direction: null});

  const fetchMyBids = async (params: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      const response = await getMyBids(params);
      setBids(response.data);

      // 알림 등을 통해 특정 상품 상세 여는 경우
      if (location.state?.openProductId) {
        setSelectedProduct({id: location.state.openProductId});
        setOpenModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch my bids:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBids(searchParams);
  }, [location.state, searchParams]);

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig({key, direction});
  };

  const getSortedBids = (): Bid[] => {
    if (!sortConfig.key || !sortConfig.direction) {
      return bids;
    }

    return [...bids].sort((a, b) => {
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
        case '입찰일':
          aValue = new Date(a.bidDate).getTime();
          bValue = new Date(b.bidDate).getTime();
          break;
        case '입찰금액':
          aValue = a.bidPrice;
          bValue = b.bidPrice;
          break;
        case '결과':
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

  const sortedBids = getSortedBids();

  const filterConfigs = [
    CATEGORY_FILTER_CONFIG,
    {
      ...BID_STATUS_FILTER_CONFIG,
      label: '상태',
    },
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
    fetchMyBids(params);
  };

  const handleViewDetail = (item: Bid) => {
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
        ) : bids.length === 0 ? (
            <EmptyState message='입찰 참여 내역이 없습니다.'/>
        ) : (
            <>
              <CommonTable
                  title='내 입찰 기록'
                  headers={TABLE_HEAD}
                  onSort={handleSort}
                  currentSort={sortConfig}
                  pagination={
                      bids.length > 0 && (
                          <Pagination
                              active={page}
                              total={Math.ceil(bids.length / 10) || 1}
                              onChange={setPage}
                          />
                      )
                  }
              >
                {sortedBids.map((item) => (
                    <tr key={item.id} className='border-b border-blue-gray-50 hover:bg-gray-50'>
                      <td className='p-4 text-gray-600'>{item.id}</td>
                      <td className='p-4 font-bold text-blue-gray-900'>{item.productName}</td>
                      <td className='p-4 text-gray-600'>
                        {new Date(item.bidDate).toLocaleDateString()}
                      </td>
                      <td className='p-4'>
                        <PriceTag price={item.bidPrice} unit={item.priceUnit}/>
                      </td>
                      <td className='p-4'>
                        <StatusBadge status={item.status}/>
                      </td>
                      <td className='p-4'>
                        <TableActionButtons onView={() => handleViewDetail(item)}/>
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

export default MyBidHistory;
