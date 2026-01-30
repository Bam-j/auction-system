import React, {useState} from "react";
import {Typography, IconButton} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";

const TABLE_HEAD = ["ID", "판매자", "상품명", "구매자", "구매일", "구매금액", "구매량", "상세"];

const AdminPurchaseHistory = () => {
  const [page, setPage] = useState(1);

  //TODO: 프론트엔드 렌더링 테스트용 가짜 데이터, 개발 후 삭제
  const purchases = [
    {id: 901, seller: "Steve", title: "인챈트 북", buyer: "Alex", date: "2026-01-25", price: 2000, amount: 1},
    {id: 902, seller: "Trader", title: "건축 자재", buyer: "Builder", date: "2026-01-24", price: 500, amount: 64},
  ];

  return (
      <CommonTable
          title="전체 구매 기록 열람"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={10} onChange={setPage}/>}
      >
        {purchases.map(({id, seller, title, buyer, date, price, amount}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4"><Typography variant="small" className="text-gray-600">{id}</Typography></td>
              <td className="p-4"><Typography variant="small" className="font-medium">{seller}</Typography></td>
              <td className="p-4"><Typography variant="small" color="blue-gray"
                                              className="font-bold">{title}</Typography></td>
              <td className="p-4"><Typography variant="small" className="font-medium text-blue-600">{buyer}</Typography>
              </td>
              <td className="p-4"><Typography variant="small" className="text-gray-600">{date}</Typography></td>
              <td className="p-4"><Typography variant="small"
                                              className="text-gray-600">{price.toLocaleString()}원</Typography></td>
              <td className="p-4"><Typography variant="small" className="text-gray-600">{amount}</Typography></td>
              <td className="p-4">
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EyeIcon className="h-4 w-4"/>
                </IconButton>
              </td>
            </tr>
        ))}
      </CommonTable>
  );
};

export default AdminPurchaseHistory;