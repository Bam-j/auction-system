import {useState, useEffect} from "react";

import {Typography, IconButton, Tooltip} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";

//절대 경로 모듈
import CommonTable from "@/components/ui/CommonTable";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import PriceTag from "@/components/ui/PriceTag";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CommonFilterBar from "@/components/ui/CommonFilterBar";
import ProductDetailModal from "@/features/product/components/ProductDetailModal";
import {
  CATEGORY_FILTER_CONFIG, BID_STATUS_FILTER_CONFIG, BIDDER_SELLER_SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from "@/constants/filterOptions.js";

//admin 도메인 내부 api
import {getAllBids} from "../api/adminApi";

const TABLE_HEAD = ["ID", "판매자", "상품명", "입찰자", "입찰일", "입찰금액", "결과", "상세"];

const AdminBidHistory = () => {
  const [page, setPage] = useState(1);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [sortConfig, setSortConfig] = useState({key: null, direction: null});

  const fetchBids = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getAllBids(params);
      setBids(response.data);
    } catch (error) {
      console.error("Failed to fetch bids:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBids(searchParams);
  }, [searchParams]);

  const handleSort = (key, direction) => {
    setSortConfig({key, direction});
  };

  const getSortedBids = () => {
    if (!sortConfig.key || !sortConfig.direction) {
      return bids;
    }

    return [...bids].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "ID":
          aValue = a.id;
          bValue = b.id;
          break;
        case "판매자":
          aValue = a.sellerName;
          bValue = b.sellerName;
          break;
        case "상품명":
          aValue = a.productName;
          bValue = b.productName;
          break;
        case "입찰자":
          aValue = a.bidderName;
          bValue = b.bidderName;
          break;
        case "입찰일":
          aValue = new Date(a.bidDate);
          bValue = new Date(b.bidDate);
          break;
        case "입찰금액":
          aValue = a.bidPrice;
          bValue = b.bidPrice;
          break;
        case "결과":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedBids = getSortedBids();

  const bidFilters = [
    CATEGORY_FILTER_CONFIG,
    BID_STATUS_FILTER_CONFIG,
    BIDDER_SELLER_SEARCH_TYPE_FILTER_CONFIG
  ];

  const handleSearch = (searchData) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchBids(params);
  };

  const handleViewDetail = (bid) => {
    setSelectedProduct({id: bid.productId});
    setOpenDetail(true);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명, 판매자 또는 입찰자 검색"
            filterConfigs={bidFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large"/>
            </div>
        ) : bids.length === 0 ? (
            <EmptyState message="입찰 기록이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="전체 입찰 기록"
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
                {sortedBids.map((bid) => (
                    <tr key={bid.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{bid.id}</td>
                      <td className="p-4 font-medium text-gray-700">{bid.sellerName}</td>
                      <td className="p-4 font-bold text-blue-gray-900">{bid.productName}</td>
                      <td className="p-4 font-medium text-blue-600">{bid.bidderName}</td>
                      <td className="p-4 text-gray-600">{new Date(bid.bidDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <PriceTag price={bid.bidPrice} unit={bid.priceUnit}/>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={bid.status}/>
                      </td>
                      <td className="p-4">
                        <Tooltip content="상세 보기">
                          <IconButton
                              size="sm"
                              variant="text"
                              color="blue-gray"
                              onClick={() => handleViewDetail(bid)}
                          >
                            <EyeIcon className="h-4 w-4"/>
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

export default AdminBidHistory;
