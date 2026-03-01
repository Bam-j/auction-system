import React, {useState, useEffect} from "react";
import {Typography, Button, IconButton, Tooltip} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getMyProducts, endSale } from "../../product/api/productApi";

const TABLE_HEAD = ["ID", "상품명", "등록일", "판매가", "재고", "상태", "상품 상세", "관리"];

const MyProductList = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getMyProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch my products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const filterConfigs = [
    {
      id: "type",
      label: "판매 방식",
      options: [
        {label: "전체", value: "ALL"},
        {label: "일반 판매", value: "FIXED"},
        {label: "경매", value: "AUCTION"},
      ],
    },
    {
      id: "status",
      label: "상태",
      options: [
        {label: "전체", value: "ALL"},
        {label: "판매중", value: "SELLING"},
        {label: "판매완료", value: "SOLD_OUT"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("등록 상품 검색:", searchData);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleEndSale = async (productId) => {
    const result = await Swal.fire({
      title: "판매 종료",
      text: "정말로 판매를 종료하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "종료하기",
      cancelButtonText: "취소",
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await endSale(productId);
        Swal.fire({
          title: "완료",
          text: "판매가 종료되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          customClass: {
            confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          },
          buttonsStyling: false
        });
        await fetchMyProducts(); // 목록 새로고침
      } catch (error) {
        console.error("Failed to end sale:", error);
        Swal.fire({
          title: "오류",
          text: error.response?.data?.message || "판매 종료 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
          customClass: {
            confirmButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          },
          buttonsStyling: false
        });
      }
    }
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
              <Typography>목록을 불러오는 중입니다...</Typography>
            </div>
        ) : products.length === 0 ? (
            <EmptyState message="등록한 상품이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="내 등록 상품 목록"
                  headers={TABLE_HEAD}
                  pagination={
                    products.length > 0 && (
                      <Pagination 
                        active={page} 
                        total={Math.ceil(products.length / 10) || 1} 
                        onChange={setPage}
                      />
                    )
                  }
              >
                {products.map((product) => (
                    <tr key={product.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-left text-gray-600">{product.id}</td>
                      <td className="p-4 text-left font-bold text-blue-gray-900">{product.title}</td>
                      <td className="p-4 text-left text-gray-600">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-left">
                        <PriceTag 
                          price={product.price} 
                          unit={product.priceUnit}
                        />
                      </td>
                      <td className="p-4 text-left text-gray-600">{product.stock || "-"}개</td>
                      <td className="p-4 text-left"><StatusBadge status={product.status}/></td>
                      
                      <td className="p-4 text-left">
                        <Tooltip content="상품 상세 보기">
                          <IconButton
                              size="sm"
                              variant="text"
                              color="blue-gray"
                              onClick={() => handleViewDetail(product)}
                          >
                            <EyeIcon className="h-4 w-4"/>
                          </IconButton>
                        </Tooltip>
                      </td>

                      <td className="p-4 text-left">
                        <Button
                            size="sm"
                            variant="gradient"
                            color="red"
                            className="whitespace-nowrap px-3"
                            onClick={() => handleEndSale(product.id)}
                            disabled={product.status === 'SOLD_OUT'}
                        >
                          판매종료
                        </Button>
                      </td>
                    </tr>
                ))}
              </CommonTable>

              <ProductManagementModal
                  open={openModal}
                  handleOpen={() => setOpenModal(!openModal)}
                  product={selectedProduct}
              />
            </>
        )}
      </div>
  );
};

export default MyProductList;
