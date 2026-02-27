import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getMyPurchaseRequests } from "../../product/api/productApi";
import { Typography } from "@material-tailwind/react";

import StatusBadge from "../../../components/ui/StatusBadge";

const TABLE_HEAD = ["ID", "상품명", "요청일", "가격", "수량", "상태", "상세"];

const MyPurchaseHistory = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await getMyPurchaseRequests();
        setPurchases(response.data);
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
                  pagination={<Pagination active={page} total={1} onChange={setPage}/>}
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
