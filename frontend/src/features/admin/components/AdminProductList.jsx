import React, {useState} from "react";
import {Button, Card, Typography} from "@material-tailwind/react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import CommonSearchInput from "../../../components/ui/CommonSearchInput";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";

const TABLE_HEAD = ["ID", "등록자", "상품명", "등록일", "판매가", "재고", "상태", "관리"];

const AdminProductList = () => {
  const [page, setPage] = useState(1);

  const products = [
    {id: 101, seller: "UserA", title: "다이아몬드 검", date: "2026-01-20", price: 5000, stock: 10, status: "SELLING"},
    {id: 102, seller: "UserB", title: "불법 아이템", date: "2026-01-21", price: 99999, stock: 1, status: "BLOCKED"},
  ];

  const handleSearch = (keyword) => {
    console.log("상품 검색:", keyword);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <Card className="p-4 shadow-sm border border-gray-200">
          <div className="flex gap-4 items-center justify-between">
            <CommonSearchInput
                placeholder="상품명 또는 등록자 검색"
                onSearch={handleSearch}
            />
            <Button variant="outlined" size="sm">상세 필터</Button>
          </div>
        </Card>

        {products.length === 0 ? (
            <EmptyState message="등록된 상품이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 등록 상품 관리"
                headers={TABLE_HEAD}
                pagination={<Pagination active={page} total={5} onChange={setPage}/>}
            >
              {products.map(({id, seller, title, date, price, stock, status}) => (
                  <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{id}</td>
                    <td className="p-4 font-bold text-blue-600">{seller}</td>
                    <td className="p-4 font-bold text-blue-gray-900">{title}</td>
                    <td className="p-4 text-gray-600">{date}</td>
                    <td className="p-4"><PriceTag price={price}/></td>
                    <td className="p-4 text-gray-600">{stock}</td>
                    <td className="p-4"><StatusBadge status={status}/></td>
                    <td className="p-4">
                      <TableActionButtons
                          onView={() => console.log("상세", id)}
                          onDelete={() => console.log("판매종료", id)}
                          deleteLabel="판매종료"
                          isBlocked={status === "BLOCKED"}
                      />
                    </td>
                  </tr>
              ))}
            </CommonTable>
        )}
      </div>
  );
};

export default AdminProductList;