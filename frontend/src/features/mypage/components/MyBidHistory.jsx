import React, {useState} from "react";
import {Typography, Chip, IconButton} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";

const TABLE_HEAD = ["ID", "상품명", "입찰일", "입찰금액", "결과", "상세"];

const MyBidHistory = () => {
  const [page, setPage] = useState(1);

  //TODO: 프론트엔드 렌더링 테스트용 가짜 데이터, 개발 후 삭제
  const bids = [
    {id: 301, title: "곡괭이", date: "2026-01-26", price: 50000, result: "WIN"},
    {id: 302, title: "드래곤 알", date: "2026-01-22", price: 120000, result: "LOSE"},
    {id: 303, title: "비콘", date: "2026-01-28", price: 30000, result: "ING"},
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

  const getResultText = (result) => {
    switch (result) {
      case "WIN":
        return "낙찰 성공";
      case "LOSE":
        return "패찰";
      default:
        return "진행중";
    }
  };

  return (
      <CommonTable
          title="내 입찰 기록"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={1} onChange={setPage}/>}
      >
        {bids.map(({id, title, date, price, result}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4"><Typography variant="small" className="text-gray-600">{id}</Typography></td>
              <td className="p-4"><Typography variant="small" color="blue-gray"
                                              className="font-bold">{title}</Typography></td>
              <td className="p-4"><Typography variant="small" className="text-gray-600">{date}</Typography></td>
              <td className="p-4"><Typography variant="small"
                                              className="text-gray-600">{price.toLocaleString()}원</Typography></td>
              <td className="p-4">
                <Chip
                    size="sm" variant="ghost"
                    value={getResultText(result)}
                    color={getResultColor(result)}
                    className="w-max"
                />
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

export default MyBidHistory;