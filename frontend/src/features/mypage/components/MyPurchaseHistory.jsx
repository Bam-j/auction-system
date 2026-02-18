import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";

const TABLE_HEAD = ["ID", "상품명", "구매일", "구매금액", "구매량", "상세"];

const MyPurchaseHistory = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const purchases = [
    {
      id: 501,
      title: "인챈트 북 (내구성 III)",
      date: "2026-01-25",
      price: 2000,
      amount: 1,
      seller: "LibraryMaster",
      status: "SOLD_OUT",
      type: "FIXED",
      description: "내구성이 아주 짱짱한 인챈트 북입니다. 한 번 바르면 안 부서져요.",
      image: null,
    },
    {
      id: 502,
      title: "참나무 원목",
      date: "2026-01-24",
      price: 100,
      amount: 64,
      seller: "WoodCutter",
      status: "SOLD_OUT",
      type: "FIXED",
      description: "갓 베어낸 신선한 참나무 원목 1세트(64개)입니다.",
      image: null,
    },
  ];

  const handleViewDetail = (item) => {
    setSelectedProduct(item);
    setOpenModal(true);
  };

  if (purchases.length === 0) {
    return <EmptyState message="구매 내역이 없습니다."/>;
  }

  return (
      <>
        <CommonTable
            title="내 구매 기록"
            headers={TABLE_HEAD}
            pagination={<Pagination active={page} total={1} onChange={setPage}/>}
        >
          {purchases.map((item) => (
              <tr key={item.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                <td className="p-4 text-gray-600">{item.id}</td>
                <td className="p-4 font-bold text-blue-gray-900">{item.title}</td>
                <td className="p-4 text-gray-600">{item.date}</td>
                <td className="p-4">
                  <PriceTag price={item.price}/>
                </td>
                <td className="p-4 text-gray-600">{item.amount}개</td>
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

export default MyPurchaseHistory;
