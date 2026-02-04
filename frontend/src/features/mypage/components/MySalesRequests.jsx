import React, {useState} from "react";
import {Button, Typography, IconButton, Tooltip} from "@material-tailwind/react";
import {EyeIcon, CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";

import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import PriceTag from "../../../components/ui/PriceTag";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/ui/StatusBadge";
import ProductDetailModal from "../../product/components/ProductDetailModal";

const TABLE_HEAD = ["ID", "상품명", "요청자", "수량", "제안가 (입찰/즉시)", "상태", "상세", "관리"];

const MySalesRequests = () => {
  const [page, setPage] = useState(1);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [requests, setRequests] = useState([
    {
      id: 1, type: "FIXED", status: "WAITING",
      productName: "다이아몬드 검", requestor: "Newbie01", amount: 2, offerPrice: 0, // 일반 판매는 제안가 '-'
      productDetail: {
        title: "다이아몬드 검",
        price: 5000,
        seller: "Me",
        stock: 10,
        status: "SELLING",
        type: "FIXED",
        image: "https://placehold.co/150"
      }
    },
    {
      id: 2, type: "AUCTION", status: "WAITING",
      productName: "황금 사과", requestor: "RichMan", amount: 0, offerPrice: 1500, // 경매는 수량 '-'
      productDetail: {
        title: "황금 사과",
        currentPrice: 1200,
        startPrice: 1000,
        bidIncrement: 100,
        seller: "Me",
        status: "AUCTION",
        type: "AUCTION",
        image: "https://placehold.co/150"
      }
    },
    {
      id: 3, type: "AUCTION", status: "Wait_Confirm", // 즉시 구매 요청
      productName: "겉날개", requestor: "FlyHigh", amount: 0, offerPrice: 50000,
      productDetail: {
        title: "겉날개",
        currentPrice: 45000,
        instantPrice: 50000,
        seller: "Me",
        status: "AUCTION",
        type: "AUCTION",
        image: "https://placehold.co/150"
      }
    },
  ]);

  const handleViewDetail = (item) => {
    setSelectedProduct(item.productDetail);
    setOpenDetail(true);
  };

  const handleAction = (id, action) => {
    const actionText = action === "ACCEPT" ? "수락" : "거절";
    if (window.confirm(`정말로 이 요청을 ${actionText}하시겠습니까?`)) {
      alert(`요청이 ${actionText}되었습니다.`);
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  if (requests.length === 0) {
    return <EmptyState message="들어온 구매/입찰 요청이 없습니다."/>;
  }

  return (
      <>
        <CommonTable
            title="판매 요청 관리"
            headers={TABLE_HEAD}
            pagination={<Pagination active={page} total={1} onChange={setPage}/>}
        >
          {requests.map((req) => (
              <tr key={req.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                <td className="p-4 text-gray-600">{req.id}</td>
                <td className="p-4 font-bold text-blue-gray-900">{req.productName}</td>
                <td className="p-4 font-medium text-blue-600">{req.requestor}</td>

                <td className="p-4 text-gray-600">
                  {req.type === "AUCTION" ? "-" : `${req.amount}개`}
                </td>

                <td className="p-4">
                  {req.type === "FIXED" ? (
                      <span className="text-gray-400">-</span>
                  ) : (
                      <PriceTag price={req.offerPrice}/>
                  )}
                </td>

                <td className="p-4">
                  <StatusBadge status="ING"/>
                </td>

                <td className="p-4">
                  <Tooltip content="상품 상세 보기">
                    <IconButton size="sm" variant="text" color="blue-gray" onClick={() => handleViewDetail(req)}>
                      <EyeIcon className="h-4 w-4"/>
                    </IconButton>
                  </Tooltip>
                </td>

                <td className="p-4 flex gap-2">
                  <Tooltip content="요청 수락">
                    <IconButton
                        size="sm" variant="gradient" color="green"
                        onClick={() => handleAction(req.id, "ACCEPT")}
                    >
                      <CheckIcon className="h-4 w-4"/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="요청 거절">
                    <IconButton
                        size="sm" variant="outlined" color="red"
                        onClick={() => handleAction(req.id, "REJECT")}
                    >
                      <XMarkIcon className="h-4 w-4"/>
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
          ))}
        </CommonTable>

        <ProductDetailModal
            open={openDetail}
            handleOpen={() => setOpenDetail(!openDetail)}
            product={selectedProduct}
        />
      </>
  );
};

export default MySalesRequests;