import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllPurchaseRequests } from "../api/adminApi";
import { Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["ID", "판매자", "상품명", "구매자", "구매일", "구매금액", "구매량", "상태"];

const AdminPurchaseHistory = () => {
  const [page, setPage] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await getAllPurchaseRequests();
        setPurchases(response.data);
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const purchaseFilters = [
    {
      id: "type",
      label: "거래 유형",
      options: [
        {label: "전체", value: "ALL"},
        {label: "일반 구매", value: "FIXED"},
        {label: "경매 낙찰", value: "AUCTION"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("관리자 구매 기록 검색:", searchData);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명, 판매자, 구매자 검색"
            filterConfigs={purchaseFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Typography>구매 기록을 불러오는 중입니다...</Typography>
            </div>
        ) : purchases.length === 0 ? (
            <EmptyState message="구매 기록이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 구매 기록 열람"
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
                      <Typography variant="small" color="blue-gray">{p.status}</Typography>
                    </td>
                  </tr>
              ))}
            </CommonTable>
        )}
      </div>
  );
};

export default AdminPurchaseHistory;
