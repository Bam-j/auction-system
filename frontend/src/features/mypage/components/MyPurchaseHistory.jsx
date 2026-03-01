import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getMyPurchaseRequests, cancelPurchaseRequest } from "../../product/api/productApi";
import { Typography, IconButton, Tooltip } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

import StatusBadge from "../../../components/ui/StatusBadge";

const TABLE_HEAD = ["ID", "상품명", "요청일", "가격", "수량", "상태", "상세", "관리"];

const MyPurchaseHistory = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPurchaseHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getMyPurchaseRequests();
      setPurchases(response.data);
    } catch (error) {
      console.error("Failed to fetch purchase history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const filterConfigs = [
    {
      id: "type",
      label: "구매 방식",
      options: [
        {label: "전체", value: "ALL"},
        {label: "일반 구매", value: "FIXED"},
        {label: "경매 낙찰", value: "AUCTION"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("구매 기록 검색:", searchData);
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
    setSelectedProduct(item);
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
              <Typography>내역을 불러오는 중입니다...</Typography>
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

              {selectedProduct && (
                  <ProductManagementModal
                      open={openModal}
                      handleOpen={() => setOpenModal(!openModal)}
                      product={selectedProduct}
                  />
              )}
            </>
        )}
      </div>
  );
};

export default MyPurchaseHistory;
