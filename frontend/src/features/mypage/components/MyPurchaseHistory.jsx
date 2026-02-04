import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons"; // 아이콘 버튼용
import EmptyState from "../../../components/ui/EmptyState";

const TABLE_HEAD = ["ID", "상품명", "구매일", "구매금액", "구매량", "상세"];

const MyPurchaseHistory = () => {
  const [page, setPage] = useState(1);

  const purchases = [
    {id: 501, title: "인챈트 북 (내구성 III)", date: "2026-01-25", price: 2000, amount: 1},
    {id: 502, title: "참나무 원목", date: "2026-01-24", price: 100, amount: 64},
  ];

  if (purchases.length === 0) {
    return <EmptyState message="구매 내역이 없습니다."/>;
  }

  return (
      <CommonTable
          title="내 구매 기록"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={1} onChange={setPage}/>}
      >
        {purchases.map(({id, title, date, price, amount}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4 text-gray-600">{id}</td>
              <td className="p-4 font-bold text-blue-gray-900">{title}</td>
              <td className="p-4 text-gray-600">{date}</td>
              <td className="p-4">
                <PriceTag price={price}/>
              </td>
              <td className="p-4 text-gray-600">{amount}개</td>
              <td className="p-4">
                <TableActionButtons onView={() => console.log("상세보기", id)}/>
              </td>
            </tr>
        ))}
      </CommonTable>
  );
};

export default MyPurchaseHistory;