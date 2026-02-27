import React, {useState, useEffect} from "react";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Button
} from "@material-tailwind/react";
import PriceTag from "../components/ui/PriceTag";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import ProductDetailModal from "../features/product/components/ProductDetailModal";
import CommonFilterBar from "@/components/ui/CommonFilterBar";
import defaultImage from "@/assets/images/general/grass_block.jpeg";
import { getProducts } from "@/features/product/api/productApi";

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productListFilters = [
    {
      id: "category",
      label: "카테고리",
      options: [
        {label: "전체", value: "ALL"},
        {label: "무기/방어구", value: "WEAPON"},
        {label: "건축 블록", value: "BLOCK"},
      ],
    },
  ];

  const handleSearch = (searchData) => {
    console.log("메인 검색:", searchData);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  return (
      <div className="max-w-screen-xl mx-auto p-6 min-h-screen">
        <div className="flex flex-col mb-6 gap-4">
          {/* 현재 단일 서비스를 제공하여 제목열을 주석 처리, 추후 확장 시 주석 해제
          <Typography variant="h3" className="font-bold text-font-dark_blue px-1">
            거래소
          </Typography>
          */}
          <CommonFilterBar
              searchPlaceholder="어떤 아이템을 찾으시나요?"
              filterConfigs={productListFilters}
              onSearch={handleSearch}
          />
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Typography>상품을 불러오는 중입니다...</Typography>
            </div>
        ) : products.length === 0 ? (
            <EmptyState message="등록된 상품이 없습니다."/>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                  <Card key={product.id} onClick={() => handleCardClick(product)}
                        className="w-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardHeader floated={false} color="blue-gray" className="relative h-42 m-0 rounded-b-none">
                      <img
                          src={product.image || defaultImage}
                          alt={product.title}
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 z-10">
                        <StatusBadge status={product.status}/>
                      </div>
                    </CardHeader>

                    <CardBody className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Typography variant="small" className="font-bold text-font-main">
                          {product.type === "AUCTION" ? "경매" : "일반 판매"}
                        </Typography>
                        <Typography variant="small" className="font-normal text-font-dark_blue">
                          판매자: <strong> {product.seller} </strong>
                        </Typography>
                      </div>
                      <Typography variant="h6" color="blue-gray" className="mb-1 truncate">
                        {product.title}
                      </Typography>
                      <PriceTag 
                        price={product.price} 
                        unit={product.priceUnit} 
                        className="text-lg text-font-dark_blue"
                      />
                    </CardBody>

                    <CardFooter className="pt-0 px-4 pb-4">
                      <Button
                          fullWidth
                          variant={product.status === "SOLD_OUT" ? "outlined" : "gradient"}
                          color={product.status === "SOLD_OUT" ? "gray" : "blue"}
                          disabled={product.status === "SOLD_OUT"}
                      >
                        {product.status === "SOLD_OUT" ? "판매 완료" : "상세 보기"}
                      </Button>
                    </CardFooter>
                  </Card>
              ))}
            </div>
        )}
        <ProductDetailModal
            open={openModal}
            handleOpen={() => setOpenModal(!openModal)}
            product={selectedProduct}
        />
      </div>
  );
};

export default HomePage;
