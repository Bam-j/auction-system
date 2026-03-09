import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import StatusBadge from "../../../components/ui/StatusBadge";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { getAllInstantBuyRequests } from "../../product/api/productApi";
import { Typography, IconButton, Tooltip } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import ProductDetailModal from "../../product/components/ProductDetailModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";

const TABLE_HEAD = ["ID", "상품명", "요청자", "판매자", "요청일", "요청 금액", "상태", "상세"];

const AdminInstantBuyHistory = () => {
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  const fetchAllInstantBuyHistory = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getAllInstantBuyRequests(params);
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch all instant buy history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInstantBuyHistory(searchParams);
  }, []);

  const instantBuyFilters = [
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
        {label: "승인됨", value: "APPROVED"},
        {label: "거부됨", value: "REJECTED"},
      ],
    },
    {
      id: "searchType",
      label: "검색 분류",
      options: [
        {label: "전체", value: "ALL"},
        {label: "상품명", value: "productName"},
        {label: "요청자", value: "requester"},
        {label: "판매자", value: "seller"},
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
    setPage(1); // 검색 시 첫 페이지로 이동
    fetchAllInstantBuyHistory(params);
  };

  const handleViewDetail = (item) => {
    setSelectedProduct({ id: item.productId });
    setOpenDetail(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <CommonFilterBar
        searchPlaceholder="상품명, 요청자 또는 판매자 검색"
        filterConfigs={instantBuyFilters}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState message="즉시 구매 요청 기록이 없습니다." />
      ) : (
        <>
          <CommonTable
            title="전체 즉시 구매 기록"
            headers={TABLE_HEAD}
            pagination={
              <Pagination
                active={page}
                total={Math.ceil(requests.length / 10) || 1}
                onChange={setPage}
              />
            }
          >
            {requests.map((item) => (
              <tr key={item.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                <td className="p-4 text-gray-600 font-medium">{item.id}</td>
                <td className="p-4 font-bold text-blue-gray-900">{item.productName}</td>
                <td className="p-4 text-gray-900">{item.requesterNickname}</td>
                <td className="p-4 text-gray-900">{item.sellerNickname}</td>
                <td className="p-4 text-gray-600 text-sm">
                  {new Date(item.requestDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <PriceTag price={item.price} unit={item.priceUnit} />
                </td>
                <td className="p-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-4">
                  <Tooltip content="상세 보기">
                    <IconButton 
                      size="sm" 
                      variant="text" 
                      color="blue-gray"
                      onClick={() => handleViewDetail(item)}
                    >
                      <EyeIcon className="h-4 w-4" />
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
