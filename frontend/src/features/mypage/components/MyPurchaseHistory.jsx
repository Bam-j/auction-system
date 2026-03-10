import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getMyPurchaseRequests, cancelPurchaseRequest } from "../../product/api/productApi";
import { Typography, IconButton, Tooltip } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import ProductDetailModal from "../../product/components/ProductDetailModal";

import StatusBadge from "../../../components/ui/StatusBadge";

const TABLE_HEAD = ["ID", "상품명", "요청일", "가격", "수량", "상태", "상세", "관리"];

const MyPurchaseHistory = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});

  const fetchPurchaseHistory = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getMyPurchaseRequests(params);
      setPurchases(response.data);

      if (location.state?.openProductId) {
        setSelectedProduct({ id: location.state.openProductId });
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch purchase history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory(searchParams);
  }, [location.state]);

  const filterConfigs = [
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
        {label: "거절됨", value: "REJECTED"},
      ],
    },
    {
      id: "searchType",
      label: "검색 분류",
      options: [
        {label: "전체", value: "ALL"},
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
    setPage(1);
    fetchPurchaseHistory(params);
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "요청 취소",
      text: "정말로 이 구매 요청을 취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "취소하기",
      cancelButtonText: "닫기",
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await cancelPurchaseRequest(id);
        await fetchPurchaseHistory();
        Swal.fire({
          title: "취소 완료",
          text: "구매 요청이 성공적으로 취소되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          customClass: {
            confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          },
          buttonsStyling: false
        });
      } catch (error) {
        console.error("Failed to cancel purchase request:", error);
        Swal.fire({
          title: "취소 실패",
          text: error.response?.data?.message || "요청 취소 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
          customClass: {
            confirmButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          },
          buttonsStyling: false
        });
      }
    }
  };

  const handleViewDetail = (item) => {
    setSelectedProduct({ id: item.productId });
    setOpenModal(true);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명 검색"
            filterConfigs={filterConfigs}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
        ) : purchases.length === 0 ? (
            <EmptyState message="구매 내역이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="내 구매 기록"
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
                {purchases.map((item) => (
                    <tr key={item.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{item.id}</td>
                      <td className="p-4 font-bold text-blue-gray-900">{item.productName}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(item.requestDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <PriceTag 
                          price={item.price} 
                          unit={item.priceUnit}
                        />
                      </td>
                      <td className="p-4 text-gray-600">{item.quantity}개</td>
                      <td className="p-4">
                        <StatusBadge status={item.status}/>
                      </td>
                      <td className="p-4">
                        <TableActionButtons onView={() => handleViewDetail(item)}/>
                      </td>
                      <td className="p-4">
                        {item.status === 'PENDING' && (
                            <Tooltip content="요청 취소">
                              <IconButton
                                  size="sm" variant="outlined" color="red"
                                  onClick={() => handleCancel(item.id)}
                              >
                                <XMarkIcon className="h-4 w-4"/>
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
