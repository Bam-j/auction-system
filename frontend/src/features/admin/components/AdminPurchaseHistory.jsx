import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";

const TABLE_HEAD = ["ID", "판매자", "상품명", "구매자", "구매일", "구매금액", "구매량", "상세"];

const AdminPurchaseHistory = () => {
  const [page, setPage] = useState(1);

  const purchases = [
    {id: 901, seller: "Steve", title: "인챈트 북", buyer: "Alex", date: "2026-01-25", price: 2000, amount: 1},
    {id: 902, seller: "Trader", title: "건축 자재", buyer: "Builder", date: "2026-01-24", price: 500, amount: 64},
  ];

  const purchaseFilters = [
    {
      id: "type",
      label: "거래 유형",
      options: [
        {label: "전체", value: "ALL"},
        {label: "일반 구매", value: "FIXED"},
        {label: "경매 낙찰", value: "AUCTION"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("관리자 구매 기록 검색:", searchData);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명, 판매자, 구매자 검색"
            filterConfigs={purchaseFilters}
            onSearch={handleSearch}
        />

        {purchases.length === 0 ? (
            <EmptyState message="구매 기록이 없습니다."/>
        ) : (
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
        )}
      </div>
  );
};

export default AdminPurchaseHistory;
