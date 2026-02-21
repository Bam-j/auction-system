import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";

const TABLE_HEAD = ["ID", "판매자", "상품명", "입찰자", "입찰일", "입찰금액", "결과", "상세"];

const AdminBidHistory = () => {
  const [page, setPage] = useState(1);

  const bids = [
    {id: 701, seller: "RichMan", title: "전설의 검", bidder: "Hero", date: "2026-01-29", price: 500000, result: "ING"},
    {id: 702, seller: "Miner", title: "다이아몬드 1세트", bidder: "Smith", date: "2026-01-28", price: 3000, result: "WIN"},
    {id: 703, seller: "Noob", title: "나무 곡괭이", bidder: "Pro", date: "2026-01-27", price: 100, result: "LOSE"},
  ];

  const bidFilters = [
    {
      id: "result",
      label: "입찰 결과",
      options: [
        {label: "전체", value: "ALL"},
        {label: "진행 중", value: "ING"},
        {label: "낙찰", value: "WIN"},
        {label: "유찰/패배", value: "LOSE"},
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

        {bids.length === 0 ? (
            <EmptyState message="입찰 기록이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 입찰 기록 열람"
                headers={TABLE_HEAD}
                pagination={<Pagination active={page} total={3} onChange={setPage}/>}
            >
              {bids.map(({id, seller, title, bidder, date, price, result}) => (
                  <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{id}</td>
                    <td className="p-4 font-medium text-gray-700">{seller}</td>
                    <td className="p-4 font-bold text-blue-gray-900">{title}</td>
                    <td className="p-4 font-medium text-blue-600">{bidder}</td>
                    <td className="p-4 text-gray-600">{date}</td>
                    <td className="p-4">
                      <PriceTag price={price}/>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={result}/>
                    </td>
                    <td className="p-4">
                      <TableActionButtons onView={() => console.log("입찰 상세 확인", id)}/>
                    </td>
                  </tr>
              ))}
            </CommonTable>
        )}
      </div>
  );
};

export default AdminBidHistory;
