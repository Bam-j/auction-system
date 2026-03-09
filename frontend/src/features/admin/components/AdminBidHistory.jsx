import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllBids } from "../api/adminApi";
import { Typography, IconButton, Tooltip } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import ProductDetailModal from "../../product/components/ProductDetailModal";

const TABLE_HEAD = ["ID", "판매자", "상품명", "입찰자", "입찰일", "입찰금액", "결과", "상세"];

const AdminBidHistory = () => {
  const [page, setPage] = useState(1);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

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
  }, []);

  const bidFilters = [
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
      label: "결과",
      options: [
        {label: "전체", value: "ALL"},
        {label: "진행 중", value: "BIDDING"},
        {label: "낙찰", value: "SUCCESS"},
        {label: "패찰", value: "FAILED"},
      ],
    },
    {
      id: "searchType",
      label: "검색 분류",
      options: [
        {label: "전체", value: "ALL"},
        {label: "판매자", value: "seller"},
        {label: "입찰자", value: "bidder"},
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
    fetchBids(params);
  };

  const handleViewDetail = (bid) => {
    setSelectedProduct({ id: bid.productId });
    setOpenDetail(true);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="판매자 또는 입찰자 검색"
            filterConfigs={bidFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
        ) : bids.length === 0 ? (
            <EmptyState message="입찰 기록이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="전체 입찰 기록"
                  headers={TABLE_HEAD}
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
                {bids.map((bid) => (
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

export default AdminBidHistory;
