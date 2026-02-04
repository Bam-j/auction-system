import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";

const TABLE_HEAD = ["ID", "판매자", "상품명", "구매자", "구매일", "구매금액", "구매량", "상세"];

const AdminPurchaseHistory = () => {
  const [page, setPage] = useState(1);

  const purchases = [
    {id: 901, seller: "Steve", title: "인챈트 북", buyer: "Alex", date: "2026-01-25", price: 2000, amount: 1},
    {id: 902, seller: "Trader", title: "건축 자재", buyer: "Builder", date: "2026-01-24", price: 500, amount: 64},
  ];

  if (purchases.length === 0) {
    return <EmptyState message="구매 기록이 없습니다."/>;
  }

  return (
      <CommonTable
          title="전체 구매 기록 열람"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={10} onChange={setPage}/>}
      >
        {purchases.map(({id, seller, title, buyer, date, price, amount}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4 text-gray-600">{id}</td>
              <td className="p-4 font-medium text-gray-700">{seller}</td>
              <td className="p-4 font-bold text-blue-gray-900">{title}</td>
              <td className="p-4 font-medium text-blue-600">{buyer}</td>
              <td className="p-4 text-gray-600">{date}</td>
              <td className="p-4">
                <PriceTag price={price}/>
              </td>
              <td className="p-4 text-gray-600">{amount}개</td>
              <td className="p-4">
                <TableActionButtons onView={() => console.log("거래 상세 확인", id)}/>
              </td>
            </tr>
        ))}
      </CommonTable>
  );
};

export default AdminPurchaseHistory;