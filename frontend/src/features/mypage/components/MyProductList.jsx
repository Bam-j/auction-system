import {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";

import {Typography, Button, IconButton, Tooltip} from "@material-tailwind/react";
import {EyeIcon} from "@heroicons/react/24/outline";
import {
  successAlert, errorAlert, confirmDanger
} from "@/utils/swalUtils";

//절대 경로 모듈
import CommonTable from "@/components/ui/CommonTable";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import PriceTag from "@/components/ui/PriceTag";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CommonFilterBar from "@/components/ui/CommonFilterBar";
import ProductManagementModal from "@/features/product/components/ProductManagementModal";
import {getMyProducts, endSale} from "@/features/product/api/productApi";
import {CATEGORY_FILTER_CONFIG, STATUS_FILTER_CONFIG, mapFilterParams} from "@/constants/filterOptions";

const TABLE_HEAD = ["ID", "상품명", "등록일", "판매가", "재고", "상태", "상품 상세", "관리"];

const MyProductList = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [sortConfig, setSortConfig] = useState({key: null, direction: null});

  const fetchMyProducts = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getMyProducts(params);
      setProducts(response.data);

      if (location.state?.openProductId) {
        setSelectedProduct({id: location.state.openProductId});
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch my products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts(searchParams);
  }, [location.state, searchParams]);

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

  const filterConfigs = [
    CATEGORY_FILTER_CONFIG,
    STATUS_FILTER_CONFIG
  ];

  const handleSearch = (searchData) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    setPage(1);
    fetchMyProducts(params);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleEndSale = async (productId) => {
    const result = await confirmDanger(
        "판매 종료",
        "정말로 판매를 종료하시겠습니까?",
        "종료하기"
    );

    if (result.isConfirmed) {
      try {
        await endSale(productId);
        await successAlert("완료", "판매가 종료되었습니다.");
        await fetchMyProducts();
      } catch (error) {
        console.error("Failed to end sale:", error);
        await errorAlert(
            "오류",
            error.response?.data?.message || "판매 종료 중 오류가 발생했습니다."
        );
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
              <LoadingSpinner size="large"/>
            </div>
        ) : products.length === 0 ? (
            <EmptyState message="등록한 상품이 없습니다."/>
        ) : (
            <>
              <CommonTable
                  title="내 등록 상품 목록"
                  headers={TABLE_HEAD}
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
