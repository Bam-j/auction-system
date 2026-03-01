import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllProducts } from "../api/adminApi";
import { Typography } from "@material-tailwind/react";

const AdminProductList = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productFilters = [
    {
      id: "category",
      label: "카테고리",
      options: [
        {label: "전체", value: "ALL"},
        {label: "무기", value: "WEAPON"},
        {label: "방어구", value: "ARMOR"},
      ],
    },
    {
      id: "status",
      label: "상태",
      options: [
        {label: "전체", value: "ALL"},
        {label: "판매중", value: "SELLING"},
        {label: "차단됨", value: "BLOCKED"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("관리자 상품 검색:", searchData);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="상품명 또는 등록자 검색"
            filterConfigs={productFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Typography>상품 목록을 불러오는 중입니다...</Typography>
            </div>
        ) : products.length === 0 ? (
            <EmptyState message="등록된 상품이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="전체 등록 상품 관리"
                  headers={["ID", "등록자", "상품명", "등록일", "판매가", "재고", "상태", "관리"]}
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
                      <td className="p-4 text-gray-600">{product.id}</td>
                      <td className="p-4 font-bold text-blue-600">{product.seller}</td>
                      <td className="p-4 font-bold text-blue-gray-900">{product.title}</td>
                      <td className="p-4 text-gray-600">{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td className="p-4"><PriceTag price={product.price} unit={product.priceUnit}/></td>
                      <td className="p-4 text-gray-600">{product.stock || "-"}개</td>
                      <td className="p-4"><StatusBadge status={product.status}/></td>
                      <td className="p-4">
                        <TableActionButtons
                            onView={() => handleViewDetail(product)}
                            onDelete={() => console.log("판매종료", product.id)}
                            deleteLabel="판매종료"
                            isBlocked={product.status === "BLOCKED"}
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

export default AdminProductList;
