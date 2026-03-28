import {useState, useEffect} from "react";

import {IconButton, Tooltip, Button, Typography} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";

//절대 경로 모듈
import CommonTable from "@/components/ui/CommonTable";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import PriceTag from "@/components/ui/PriceTag";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CommonFilterBar from "@/components/ui/CommonFilterBar";
import ProductManagementModal from "@/features/product/components/ProductManagementModal";
import {
  CATEGORY_FILTER_CONFIG, STATUS_FILTER_CONFIG, PRODUCT_ADMIN_SEARCH_TYPE_FILTER_CONFIG,
  mapFilterParams
} from "@/constants/filterOptions";

//auth 도메인 내부 api
import {getAllProducts} from "../api/adminApi";

const AdminProductList = () => {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [sortConfig, setSortConfig] = useState({key: null, direction: null});

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

  const handleSort = (key, direction) => {
    setSortConfig({key, direction});
  };

  const getSortedProducts = () => {
    if (!sortConfig.key || !sortConfig.direction) {
      return products;
    }

    return [...products].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "ID":
          aValue = a.id;
          bValue = b.id;
          break;
        case "등록자":
          aValue = a.seller;
          bValue = b.seller;
          break;
        case "상품명":
          aValue = a.title;
          bValue = b.title;
          break;
        case "등록일":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "판매가":
          aValue = a.price;
          bValue = b.price;
          break;
        case "재고":
          aValue = a.stock || 0;
          bValue = b.stock || 0;
          break;
        case "상태":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedProducts = getSortedProducts();

  const productFilters = [
    CATEGORY_FILTER_CONFIG,
    STATUS_FILTER_CONFIG,
    PRODUCT_ADMIN_SEARCH_TYPE_FILTER_CONFIG
  ];

  const handleSearch = (searchData) => {
    const params = mapFilterParams(searchData);
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
              <LoadingSpinner size="large"/>
            </div>
        ) : products.length === 0 ? (
            <EmptyState message="등록된 상품이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="전체 상품 관리"
                  headers={["ID", "등록자", "상품명", "등록일", "판매가", "재고", "상태", "상품 상세", "관리"]}
                  onSort={handleSort}
                  currentSort={sortConfig}
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
                {sortedProducts.map((product) => (
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
