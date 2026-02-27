import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getMyProducts } from "../../product/api/productApi";

const TABLE_HEAD = ["ID", "상품명", "등록일", "판매가", "재고", "상태", "관리"];

const MyProductList = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await getMyProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch my products:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
                  pagination={<Pagination active={page} total={3} onChange={setPage}/>}
              >
                {products.map((product) => (
                    <tr key={product.id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{product.id}</td>
                      <td className="p-4 font-bold text-blue-gray-900">{product.title}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <PriceTag 
                          price={product.price} 
                          unit={product.priceUnit}
                        />
                      </td>
                      <td className="p-4 text-gray-600">{product.stock || "-"}개</td>
                      <td className="p-4"><StatusBadge status={product.status}/></td>
                      <td className="p-4">
                        <TableActionButtons
                            onView={() => handleViewDetail(product)}
                            onDelete={() => console.log("판매종료", product.id)}
                            deleteLabel="판매종료"
                        />
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
