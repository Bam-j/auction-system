import React, {useState, useEffect} from "react";
import {Button, Typography, IconButton, Tooltip} from "@material-tailwind/react";
import {EyeIcon, CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/ui/StatusBadge";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { 
  getIncomingPurchaseRequests, 
  approvePurchaseRequest, 
  rejectPurchaseRequest 
} from "../../product/api/productApi";

const TABLE_HEAD = ["ID", "상품명", "수량", "가격", "상태", "요청 일시", "상세", "관리"];

const MySalesRequests = () => {
  const [page, setPage] = useState(1);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncomingRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getIncomingPurchaseRequests();
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch incoming requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const filterConfigs = [
    {
      id: "type",
      label: "요청 종류",
      options: [
        {label: "전체", value: "ALL"},
        {label: "일반 구매", value: "FIXED"},
        {label: "경매 입찰", value: "AUCTION"},
      ],
    },
    {
      id: "status",
      label: "상태",
      options: [
        {label: "전체", value: "ALL"},
        {label: "대기중", value: "WAITING"},
        {label: "승인/거절됨", value: "DONE"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("판매 요청 검색:", searchData);
  };

  const handleViewDetail = (item) => {
    setSelectedProduct(item.productDetail);
    setOpenDetail(true);
  };

  const handleAction = async (id, action) => {
    const isAccept = action === "ACCEPT";
    const actionText = isAccept ? "수락" : "거절";

    const result = await Swal.fire({
      title: `요청 ${actionText}`,
      text: `정말로 이 요청을 ${actionText}하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: "취소",
      customClass: {
        confirmButton: isAccept
            ? "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            : "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        if (isAccept) {
          await approvePurchaseRequest(id);
        } else {
          await rejectPurchaseRequest(id);
        }

        await fetchIncomingRequests();

        Swal.fire({
          title: "처리 완료",
          text: `요청이 ${actionText}되었습니다.`,
          icon: "success",
          confirmButtonText: "확인",
          customClass: {
            confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          },
          buttonsStyling: false
        });
      } catch (error) {
        console.error(`Failed to ${action} purchase request:`, error);
        Swal.fire({
          title: "처리 실패",
          text: error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.",
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

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명 검색"
            filterConfigs={filterConfigs}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Typography>요청 목록을 불러오는 중입니다...</Typography>
            </div>
        ) : requests.length === 0 ? (
            <EmptyState message="들어온 구매 요청이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="판매 요청 관리"
                  headers={TABLE_HEAD}
                  pagination={
                    requests.length > 0 && (
                      <Pagination 
                        active={page} 
                        total={Math.ceil(requests.length / 10) || 1} 
                        onChange={setPage}
                      />
                    )
                  }
              >
                {requests.map((req) => (
                    <tr key={req.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{req.id}</td>
                      <td className="p-4 font-bold text-blue-gray-900">{req.productName}</td>
                      <td className="p-4 text-gray-600">{req.quantity}개</td>
                      <td className="p-4">
                        <PriceTag 
                          price={req.price} 
                          unit={req.priceUnit}
                        />
                      </td>
                      <td className="p-4">
                        <StatusBadge status={req.status}/>
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(req.requestDate).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <Tooltip content="상품 상세 보기">
                          <IconButton size="sm" variant="text" color="blue-gray" onClick={() => handleViewDetail(req)}>
                            <EyeIcon className="h-4 w-4"/>
                          </IconButton>
                        </Tooltip>
                      </td>

                      <td className="p-4 flex gap-2">
                        {req.status === 'PENDING' ? (
                            <>
                              <Tooltip content="요청 수락">
                                <IconButton
                                    size="sm" variant="gradient" color="green"
                                    onClick={() => handleAction(req.id, "ACCEPT")}
                                >
                                  <CheckIcon className="h-4 w-4"/>
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="요청 거절">
                                <IconButton
                                    size="sm" variant="outlined" color="red"
                                    onClick={() => handleAction(req.id, "REJECT")}
                                >
                                  <XMarkIcon className="h-4 w-4"/>
                                </IconButton>
                              </Tooltip>
                            </>
                        ) : (
                            <Typography variant="small" color="gray">처리완료</Typography>
                        )}
                      </td>
                    </tr>
                ))}
              </CommonTable>

              <ProductManagementModal
                  open={openDetail}
                  handleOpen={() => setOpenDetail(!openDetail)}
                  product={selectedProduct}
              />
            </>
        )}
      </div>
  );
};

export default MySalesRequests;
