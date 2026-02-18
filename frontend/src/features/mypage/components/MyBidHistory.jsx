import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";

const TABLE_HEAD = ["ID", "상품명", "입찰일", "입찰금액", "결과", "상세"];

const MyBidHistory = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const bids = [
    {
      id: 301,
      title: "전설의 곡괭이",
      date: "2026-01-26",
      price: 50000,
      result: "WIN",
      type: "AUCTION",
      status: "SOLD_OUT",
      seller: "MiningKing",
      image: null,
      description: "전설적인 광부에게 전해져 내려오는 곡괭이입니다.",
      currentPrice: 50000,
      bidIncrement: 1000,
    },
    {
      id: 302,
      title: "드래곤 알",
      date: "2026-01-22",
      price: 120000,
      result: "LOSE",
      type: "AUCTION",
      status: "SOLD_OUT",
      seller: "EnderSlayer",
      image: null,
      currentPrice: 150000,
    },
    {
      id: 303,
      title: "비콘",
      date: "2026-01-28",
      price: 30000,
      result: "ING",
      type: "AUCTION",
      status: "AUCTION",
      seller: "BuilderBob",
      image: null,
      currentPrice: 30000,
      bidIncrement: 500,
      startPrice: 10000,
    },
  ];

  const handleViewDetail = (item) => {
    setSelectedProduct(item);
    setOpenModal(true);
  };

  if (bids.length === 0) {
    return <EmptyState message="입찰 참여 내역이 없습니다."/>;
  }

  return (
      <>
        <CommonTable
            title="내 입찰 기록"
            headers={TABLE_HEAD}
            pagination={<Pagination active={page} total={1} onChange={setPage}/>}
        >
          {bids.map((item) => (
              <tr key={item.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                <td className="p-4 text-gray-600">{item.id}</td>
                <td className="p-4 font-bold text-blue-gray-900">{item.title}</td>
                <td className="p-4 text-gray-600">{item.date}</td>
                <td className="p-4">
                  <PriceTag price={item.price}/>
                </td>
                <td className="p-4">
                  <StatusBadge status={item.result}/>
                </td>
                <td className="p-4">
                  <TableActionButtons onView={() => handleViewDetail(item)}/>
                </td>
              </tr>
          ))}
        </CommonTable>

        {selectedProduct && (
            <ProductManagementModal
                open={openModal}
                handleOpen={() => setOpenModal(!openModal)}
                product={selectedProduct}
            />
        )}
      </>
  );
};

export default MyBidHistory;
