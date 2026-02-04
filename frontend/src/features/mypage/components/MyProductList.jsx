import React, {useState} from "react";
import {Typography} from "@material-tailwind/react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";

const TABLE_HEAD = ["ID", "상품명", "등록일", "판매가", "재고", "상태", "관리"];

const MyProductList = () => {
  const [page, setPage] = useState(1);

  const products = [
    {id: 101, title: "다이아몬드 검", date: "2026-01-20", price: 5000, stock: 10, status: "SELLING"},
    {id: 102, title: "철 갑옷 세트", date: "2026-01-18", price: 3000, stock: 0, status: "SOLD_OUT"},
    {id: 103, title: "황금 사과", date: "2026-01-15", price: 15000, stock: 5, status: "AUCTION"},
  ];

  if (products.length === 0) {
    return <EmptyState message="등록한 상품이 없습니다."/>;
  }

  return (
      <CommonTable
          title="내 등록 상품 목록"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={3} onChange={setPage}/>}
      >
        {products.map(({id, title, date, price, stock, status}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4 text-gray-600">{id}</td>
              <td className="p-4 font-bold text-blue-gray-900">{title}</td>
              <td className="p-4 text-gray-600">{date}</td>
              <td className="p-4">
                <PriceTag price={price}/>
              </td>
              <td className="p-4 text-gray-600">{stock}개</td>
              <td className="p-4">
                <StatusBadge status={status}/>
              </td>
              <td className="p-4">
                <TableActionButtons
                    onView={() => console.log("상세보기", id)}
                    onDelete={() => console.log("판매종료", id)}
                    deleteLabel="판매종료"
                />
              </td>
            </tr>
        ))}
      </CommonTable>
  );
};

export default MyProductList;