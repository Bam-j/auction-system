import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllBids } from "../api/adminApi";
import { Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["ID", "판매자", "상품명", "입찰자", "입찰일", "입찰금액", "결과"];

const AdminBidHistory = () => {
  const [page, setPage] = useState(1);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await getAllBids();
        setBids(response.data);
      } catch (error) {
        console.error("Failed to fetch bids:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBids();
  }, []);

  const bidFilters = [
    {
      id: "result",
      label: "입찰 결과",
      options: [
        {label: "전체", value: "ALL"},
        {label: "진행 중", value: "BIDDING"},
        {label: "낙찰", value: "SUCCESS"},
        {label: "유찰/패배", value: "FAILED"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("관리자 입찰 기록 검색:", searchData);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명, 판매자, 입찰자 검색"
            filterConfigs={bidFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Typography>입찰 기록을 불러오는 중입니다...</Typography>
            </div>
        ) : bids.length === 0 ? (
            <EmptyState message="입찰 기록이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 입찰 기록 열람"
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
                  </tr>
              ))}
            </CommonTable>
        )}
      </div>
  );
};

export default AdminBidHistory;
