import React, {useState} from "react";
import {Typography, Chip, Button, IconButton} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";

const TABLE_HEAD = ["ID", "상품명", "등록일", "판매가", "재고", "상태", "관리"];

const MyProductList = () => {
  const [page, setPage] = useState(1);

  //TODO: 프론트엔드 렌더링 테스트용 가짜 데이터, 개발 후 삭제
  const products = [
    {id: 101, title: "다이아몬드 검", date: "2026-01-20", price: 5000, stock: 10, status: "SELLING"},
    {id: 102, title: "철 갑옷 세트", date: "2026-01-18", price: 3000, stock: 0, status: "SOLD_OUT"},
    {id: 103, title: "황금 사과", date: "2026-01-15", price: 15000, stock: 5, status: "AUCTION"},
  ];

  return (
      <CommonTable
          title="내 등록 상품 목록"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={3} onChange={setPage}/>}
      >
        {products.map(({id, title, date, price, stock, status}, index) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4"><Typography variant="small" className="font-normal text-gray-600">{id}</Typography>
              </td>
              <td className="p-4"><Typography variant="small" color="blue-gray"
                                              className="font-bold">{title}</Typography></td>
              <td className="p-4"><Typography variant="small" className="font-normal text-gray-600">{date}</Typography>
              </td>
              <td className="p-4"><Typography variant="small"
                                              className="font-normal text-gray-600">{price.toLocaleString()}원</Typography>
              </td>
              <td className="p-4"><Typography variant="small"
                                              className="font-normal text-gray-600">{stock}개</Typography></td>
              <td className="p-4">
                <Chip
                    size="sm" variant="ghost" value={status}
                    color={status === "SELLING" ? "green" : status === "SOLD_OUT" ? "blue-gray" : "blue"}
                    className="w-max"
                />
              </td>
              <td className="p-4 flex gap-2">
                <Button size="sm" color="red" variant="text">판매종료</Button>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EyeIcon className="h-4 w-4"/>
                </IconButton>
              </td>
            </tr>
        ))}
      </CommonTable>
  );
};

export default MyProductList;