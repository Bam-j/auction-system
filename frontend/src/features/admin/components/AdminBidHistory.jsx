import React, {useState} from "react";
import {Typography, Chip, IconButton} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";

const TABLE_HEAD = ["ID", "판매자", "상품명", "입찰자", "입찰일", "입찰금액", "결과", "상세"];

const AdminBidHistory = () => {
  const [page, setPage] = useState(1);

  //TODO: 프론트엔드 렌더링 테스트용 가짜 데이터, 개발 후 삭제
  const bids = [
    {id: 701, seller: "RichMan", title: "전설의 검", bidder: "Hero", date: "2026-01-29", price: 500000, result: "ING"},
    {id: 702, seller: "Miner", title: "다이아몬드 1세트", bidder: "Smith", date: "2026-01-28", price: 3000, result: "WIN"},
  ];

  const getResultColor = (result) => {
    switch (result) {
      case "WIN":
        return "green";
      case "LOSE":
        return "red";
      default:
        return "blue";
    }
  };

  return (
      <CommonTable
          title="전체 입찰 기록 열람"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={3} onChange={setPage}/>}
      >
        {bids.map(({id, seller, title, bidder, date, price, result}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4"><Typography variant="small" className="text-gray-600">{id}</Typography></td>
              <td className="p-4"><Typography variant="small" className="font-medium">{seller}</Typography></td>
              <td className="p-4"><Typography variant="small" color="blue-gray"
                                              className="font-bold">{title}</Typography></td>
              <td className="p-4"><Typography variant="small"
                                              className="font-medium text-blue-600">{bidder}</Typography></td>
              <td className="p-4"><Typography variant="small" className="text-gray-600">{date}</Typography></td>
              <td className="p-4"><Typography variant="small"
                                              className="text-gray-600">{price.toLocaleString()}원</Typography></td>
              <td className="p-4">
                <Chip size="sm" variant="ghost" value={result} color={getResultColor(result)} className="w-max"/>
              </td>
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

export default AdminBidHistory;