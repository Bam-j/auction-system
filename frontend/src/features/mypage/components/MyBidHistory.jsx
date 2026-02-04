import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";

const TABLE_HEAD = ["ID", "상품명", "입찰일", "입찰금액", "결과", "상세"];

const MyBidHistory = () => {
  const [page, setPage] = useState(1);

  const bids = [
    {id: 301, title: "전설의 곡괭이", date: "2026-01-26", price: 50000, result: "WIN"},
    {id: 302, title: "드래곤 알", date: "2026-01-22", price: 120000, result: "LOSE"},
    {id: 303, title: "비콘", date: "2026-01-28", price: 30000, result: "ING"},
  ];

  if (bids.length === 0) {
    return <EmptyState message="입찰 참여 내역이 없습니다."/>;
  }

  return (
      <CommonTable
          title="내 입찰 기록"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={1} onChange={setPage}/>}
      >
        {bids.map(({id, title, date, price, result}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4 text-gray-600">{id}</td>
              <td className="p-4 font-bold text-blue-gray-900">{title}</td>
              <td className="p-4 text-gray-600">{date}</td>
              <td className="p-4">
                <PriceTag price={price}/>
              </td>
              <td className="p-4">
                <StatusBadge status={result}/>
              </td>
              <td className="p-4">
                <TableActionButtons onView={() => console.log("입찰상세", id)}/>
              </td>
            </tr>
        ))}
      </CommonTable>
  );
};

export default MyBidHistory;