import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllPurchaseRequests } from "../api/adminApi";
import StatusBadge from "../../../components/ui/StatusBadge";

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
  }, []);

  const purchaseFilters = [
    {
      id: "category",
      label: "카테고리",
      options: [
        {label: "전체", value: "ALL"},
        {label: "무기", value: "WEAPON"},
        {label: "방어구", value: "ARMOR"},
        {label: "도구", value: "TOOL"},
        {label: "치장품", value: "COSMETIC"},
        {label: "칭호", value: "TITLE"},
        {label: "블록", value: "BLOCK"},
        {label: "레드스톤 장치", value: "REDSTONE_DEVICES"},
        {label: "광석", value: "ORE"},
        {label: "성장 재화", value: "GROWTH_GOODS"},
        {label: "기타", value: "ETC"},
      ],
    },
    {
      id: "status",
      label: "상태",
      options: [
        {label: "전체", value: "ALL"},
        {label: "대기중", value: "PENDING"},
        {label: "승인됨", value: "APPROVED"},
        {label: "거부됨", value: "REJECTED"},
      ],
    },
    {
      id: "searchType",
      label: "검색 분류",
      options: [
        {label: "전체", value: "ALL"},
        {label: "판매자", value: "seller"},
        {label: "구매자", value: "buyer"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    const params = {
      category: searchData.category === "ALL" ? "" : searchData.category,
      status: searchData.status === "ALL" ? "" : searchData.status,
      searchType: searchData.searchType === "ALL" ? "" : searchData.searchType,
      keyword: searchData.keyword || ""
    };
    setSearchParams(params);
    setPage(1);
    fetchPurchases(params);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="판매자 또는 구매자 검색"
            filterConfigs={purchaseFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
        ) : purchases.length === 0 ? (
            <EmptyState message="일반 구매 기록이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 일반 구매 기록"
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
