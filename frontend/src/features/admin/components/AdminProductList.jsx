import React, {useState, useEffect} from "react";
import {IconButton, Tooltip, Button, Typography} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import PriceTag from "../../../components/ui/PriceTag";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ProductManagementModal from "../../product/components/ProductManagementModal";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllProducts } from "../api/adminApi";

const AdminProductList = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});

  const fetchProducts = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getAllProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchParams);
  }, []);

  const productFilters = [
    {
      id: "category",
      label: "카테고리",
      options: [
        {label: "전체", value: "ALL"},
        {label: "무기", value: "WEAPON"},
        {label: "방어구", value: "ARMOR"},
        {label: "도구", value: "TOOL"},
        {label: "치장품", value: "COSMETIC"},
        {label: "칭호", value: "TITLE"},
        {label: "블록", value: "BLOCK"},
        {label: "레드스톤 장치", value: "REDSTONE_DEVICES"},
        {label: "광석", value: "ORE"},
        {label: "성장 재화", value: "GROWTH_GOODS"},
        {label: "기타", value: "ETC"},
      ],
    },
    {
      id: "status",
      label: "상태",
      options: [
        {label: "전체", value: "ALL"},
        {label: "판매중", value: "FIXED_SALES"},
        {label: "경매중", value: "AUCTION"},
        {label: "판매 완료", value: "SOLD_OUT"},
        {label: "즉시구매완료", value: "INSTANT_BUY"},
      ],
    },
    {
      id: "searchType",
      label: "검색 분류",
      options: [
        {label: "전체", value: "ALL"},
        {label: "상품명", value: "productName"},
        {label: "등록자", value: "registrant"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    const params = {
      category: searchData.category === "ALL" ? "" : searchData.category,
      status: searchData.status === "ALL" ? "" : searchData.status,
      searchType: searchData.searchType === "ALL" ? "" : searchData.searchType,
      keyword: searchData.keyword || ""
    };
    setSearchParams(params);
    fetchProducts(params);
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
              <LoadingSpinner size="large" />
            </div>
        ) : products.length === 0 ? (
            <EmptyState message="등록된 상품이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="전체 상품 관리"
                  headers={["ID", "등록자", "상품명", "등록일", "판매가", "재고", "상태", "상품 상세", "관리"]}

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
                      <td className="p-4 text-left font-bold text-blue-600">{product.seller}</td>
                      <td className="p-4 text-left font-bold text-blue-gray-900">{product.title}</td>
                      <td className="p-4 text-left text-gray-600">{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-left"><PriceTag price={product.price} unit={product.priceUnit}/></td>
                      <td className="p-4 text-left text-gray-600">
                        {product.type === "AUCTION" || product.status === "AUCTION" ? "-" : `${product.stock || 0}개`}
                      </td>
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
                            onClick={() => console.log("판매종료", product.id)}
                            disabled={product.status === "SOLD_OUT"}
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

export default AdminProductList;
