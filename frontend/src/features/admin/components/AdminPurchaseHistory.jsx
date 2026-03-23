import {useState, useEffect} from "react";

//절대 경로 모듈
import CommonTable from "@/components/ui/CommonTable";
import Pagination from "@/components/ui/Pagination";
import PriceTag from "@/components/ui/PriceTag";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CommonFilterBar from "@/components/ui/CommonFilterBar";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  CATEGORY_FILTER_CONFIG, PURCHASE_REQUEST_STATUS_FILTER_CONFIG, BUYER_SELLER_SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from "@/constants/filterOptions.js";

//auth 도메인 내부 api
import {getAllPurchaseRequests} from "../api/adminApi";

const TABLE_HEAD = ["ID", "판매자", "상품명", "구매자", "구매일", "구매금액", "구매량", "상태"];

const AdminPurchaseHistory = () => {
  const [page, setPage] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});

  const fetchPurchases = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getAllPurchaseRequests(params);
      setPurchases(response.data);
    } catch (error) {
      console.error("Failed to fetch purchase history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(searchParams);
  }, [searchParams]);

  const purchaseFilters = [
    CATEGORY_FILTER_CONFIG,
    PURCHASE_REQUEST_STATUS_FILTER_CONFIG,
    BUYER_SELLER_SEARCH_TYPE_FILTER_CONFIG
  ];

  const handleSearch = (searchData) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchPurchases(params);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명, 판매자 또는 요청자 검색"
            filterConfigs={purchaseFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large"/>
            </div>
        ) : purchases.length === 0 ? (
            <EmptyState message="구매 요청 기록이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 구매 요청 기록"
                headers={TABLE_HEAD}
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
              {purchases.map((p) => (
                  <tr key={p.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{p.id}</td>
                    <td className="p-4 font-medium text-gray-700">{p.sellerName}</td>
                    <td className="p-4 font-bold text-blue-gray-900">{p.productName}</td>
                    <td className="p-4 font-medium text-blue-600">{p.buyerName}</td>
                    <td className="p-4 text-gray-600">{new Date(p.requestDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <PriceTag price={p.price} unit={p.priceUnit}/>
                    </td>
                    <td className="p-4 text-gray-600">{p.quantity}개</td>
                    <td className="p-4">
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
