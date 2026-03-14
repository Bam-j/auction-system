import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import StatusBadge from "../../../components/ui/StatusBadge";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { getMyInstantBuyRequests, approveInstantBuy, rejectInstantBuy } from "../../product/api/productApi";
import { Typography, Button, IconButton, Tooltip } from "@material-tailwind/react";
import { CheckIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import useAuthStore from "../../../stores/useAuthStore";
import Swal from "sweetalert2";
import ProductDetailModal from "../../product/components/ProductDetailModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import {
  CATEGORY_FILTER_CONFIG,
  PURCHASE_REQUEST_STATUS_FILTER_CONFIG,
  mapFilterParams
} from "@/constants/filterOptions.js";

const TABLE_HEAD = ["ID", "상품명", "요청자", "요청일", "요청 금액", "상태", "수락", "상세"];

const MyInstantBuyHistory = () => {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  const fetchInstantBuyHistory = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getMyInstantBuyRequests(params);
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch instant buy history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstantBuyHistory(searchParams);
  }, []);

  const filterConfigs = [
    CATEGORY_FILTER_CONFIG,
    PURCHASE_REQUEST_STATUS_FILTER_CONFIG
  ];

  const handleSearch = (searchData) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchInstantBuyHistory(params);
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: "요청 수락",
      text: "이 즉시 구매 요청을 수락하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "수락",
      cancelButtonText: "취소",
      customClass: {
        confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await approveInstantBuy(id);
        await fetchInstantBuyHistory(searchParams);
        Swal.fire("수락 완료", "요청이 수락되었습니다.", "success");
      } catch (error) {
        Swal.fire("오류", error.response?.data?.message || "처리 중 오류가 발생했습니다.", "error");
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "요청 거절",
      text: "이 즉시 구매 요청을 거절하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "거절",
      cancelButtonText: "취소",
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await rejectInstantBuy(id);
        await fetchInstantBuyHistory(searchParams);
        Swal.fire("거절 완료", "요청이 거절되었습니다.", "info");
      } catch (error) {
        Swal.fire("오류", error.response?.data?.message || "처리 중 오류가 발생했습니다.", "error");
      }
    }
  };

  const handleViewDetail = (item) => {
    setSelectedProduct({ id: item.productId });
    setOpenDetail(true);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <CommonFilterBar
        searchPlaceholder="상품명 또는 상대방 닉네임 검색"
        filterConfigs={filterConfigs}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState message="즉시 구매 요청 내역이 없습니다." />
      ) : (
        <>
          <CommonTable
            title="즉시 구매 요청 기록"
            headers={TABLE_HEAD}
            pagination={
              <Pagination
                active={page}
                total={Math.ceil(requests.length / 10) || 1}
                onChange={setPage}
              />
            }
          >
            {requests.map((item) => {
              const isRequester = item.requesterNickname === user?.nickname;
              return (
                <tr key={item.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{item.id}</td>
                  <td className="p-4 font-bold text-blue-gray-900">{item.productName}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={`text-sm ${isRequester ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                        {item.requesterNickname}
                      </span>
                      {isRequester && <span className="text-[10px] text-blue-400 font-normal">(본인)</span>}
                    </div>
                  </td>
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
                    <div className="flex gap-2">
                      <Tooltip content={isRequester ? "본인 요청은 수락할 수 없습니다" : "수락"}>
                        <IconButton
                          size="sm"
                          variant="gradient"
                          color="green"
                          disabled={isRequester || item.status !== "PENDING"}
                          onClick={() => handleApprove(item.id)}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      {!isRequester && item.status === "PENDING" && (
                        <Tooltip content="거절">
                          <IconButton
                            size="sm"
                            variant="outlined"
                            color="red"
                            onClick={() => handleReject(item.id)}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
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
              );
            })}
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

export default MyInstantBuyHistory;
