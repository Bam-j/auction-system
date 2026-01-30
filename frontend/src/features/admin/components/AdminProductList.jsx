import React, {useState} from "react";
import {Typography, Chip, Button, IconButton, Input, Card} from "@material-tailwind/react";
import {EyeIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";

const TABLE_HEAD = ["ID", "등록자", "상품명", "등록일", "판매가", "재고", "상태", "관리"];

const AdminProductList = () => {
  const [page, setPage] = useState(1);

  //TODO: 프론트엔드 렌더링 테스트용 가짜 데이터, 개발 후 삭제
  const products = [
    {id: 101, seller: "UserA", title: "다이아몬드 검", date: "2026-01-20", price: 5000, stock: 10, status: "SELLING"},
    {id: 102, seller: "UserB", title: "불법 아이템", date: "2026-01-21", price: 99999, stock: 1, status: "BLOCKED"},
    {id: 103, seller: "UserC", title: "황금 사과", date: "2026-01-15", price: 15000, stock: 5, status: "AUCTION"},
  ];

  return (
      <div className="flex flex-col gap-4 h-full">
        <Card className="p-4 shadow-sm border border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="w-72">
              <Input label="상품명 또는 등록자 검색" icon={<MagnifyingGlassIcon className="h-5 w-5"/>}/>
            </div>
            <Button variant="outlined" size="sm">상세 필터 (준비중)</Button>
          </div>
        </Card>

        <CommonTable
            title="전체 등록 상품 관리"
            headers={TABLE_HEAD}
            pagination={<Pagination active={page} total={5} onChange={setPage}/>}
        >
          {products.map(({id, seller, title, date, price, stock, status}) => (
              <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                <td className="p-4"><Typography variant="small" className="text-gray-600">{id}</Typography></td>
                <td className="p-4"><Typography variant="small"
                                                className="font-bold text-blue-600">{seller}</Typography></td>
                <td className="p-4"><Typography variant="small" color="blue-gray"
                                                className="font-bold">{title}</Typography></td>
                <td className="p-4"><Typography variant="small" className="text-gray-600">{date}</Typography></td>
                <td className="p-4"><Typography variant="small"
                                                className="text-gray-600">{price.toLocaleString()}원</Typography></td>
                <td className="p-4"><Typography variant="small" className="text-gray-600">{stock}</Typography></td>
                <td className="p-4">
                  <Chip
                      size="sm" variant="ghost" value={status}
                      color={status === "SELLING" ? "green" : status === "BLOCKED" ? "red" : "blue"}
                      className="w-max"
                  />
                </td>
                <td className="p-4 flex gap-2">
                  <Button size="sm" color="red" variant="text" className="whitespace-nowrap">판매종료</Button>
                  <IconButton size="sm" variant="text" color="blue-gray">
                    <EyeIcon className="h-4 w-4"/>
                  </IconButton>
                </td>
              </tr>
          ))}
        </CommonTable>
      </div>
  );
};

export default AdminProductList;