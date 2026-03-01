import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getMyBids } from "../../product/api/productApi";
import { Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["ID", "상품명", "입찰일", "입찰금액", "결과", "상세"];

const MyBidHistory = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const response = await getMyBids();
        setBids(response.data);
      } catch (error) {
        console.error("Failed to fetch my bids:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  const filterConfigs = [
    {
      id: "result",
      label: "입찰 결과",
      options: [
        {label: "전체", value: "ALL"},
        {label: "진행 중", value: "BIDDING"},
        {label: "낙찰", value: "SUCCESS"},
        {label: "유찰/패배", value: "FAILED"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("입찰 기록 검색:", searchData);
  };

  const handleViewDetail = (item) => {
    setSelectedProduct(item);
    setOpenModal(true);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명 검색"
            filterConfigs={filterConfigs}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Typography>입찰 내역을 불러오는 중입니다...</Typography>
            </div>
        ) : bids.length === 0 ? (
            <EmptyState message="입찰 참여 내역이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="내 입찰 기록"
                  headers={TABLE_HEAD}
                  pagination={
                    bids.length > 0 && (
                      <Pagination 
                        active={page} 
                        total={Math.ceil(bids.length / 10) || 1} 
                        onChange={setPage}
                      />
                    )
                  }
              >
                {bids.map((item) => (
                    <tr key={item.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{item.id}</td>
                      <td className="p-4 font-bold text-blue-gray-900">{item.productName}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(item.bidDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <PriceTag price={item.bidPrice} unit={item.priceUnit}/>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={item.status}/>
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
        )}
      </div>
  );
};

export default MyBidHistory;
