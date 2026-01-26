import {useState, useEffect} from "react";
import {Tabs, TabsHeader, Tab} from "@material-tailwind/react";

import ProductCard from "../features/product/components/ProductCard";
import ProductFilter from "../features/product/components/ProductFilter";
import Pagination from "../components/ui/Pagination";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 960) {
        setItemsPerPage(20);
      } else {
        setItemsPerPage(50);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActivePage(1);
  }, [activeTab]);

  // TODO: 화면 구성 확인용 Mock 데이터 지우기
  const mockProducts = Array.from({length: 200}).map((_, index) => ({
    id: index,
    title: `마인크래프트 아이템 #${index + 1}`,
    price: (Math.floor(Math.random() * 100) + 1) * 1000,
    quantity: Math.floor(Math.random() * 10) + 1,
    seller: `User${index}`,
    type: index % 2 === 0 ? "AUCTION" : "FIXED",
    status: ["SELLING", "SOLD_OUT", "BIDDING", "CLOSED"][Math.floor(Math.random() * 4)],
    image: null,
  }));

  const filteredProducts = mockProducts.filter((item) => {
    if (activeTab === "all") {
      return true;
    }
    if (activeTab === "fixed") {
      return item.type === "FIXED";
    }
    if (activeTab === "auction") {
      return item.type === "AUCTION";
    }
    return true;
  });

  const lastItemIndex = activePage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentProducts = filteredProducts.slice(firstItemIndex, lastItemIndex);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
      <div className="w-full">
        <div className="bg-white shadow-sm mb-6">
          <div className="container mx-auto px-4 py-2">
            <Tabs value={activeTab} className="w-full md:w-max">
              <TabsHeader
                  className="bg-transparent"
                  indicatorProps={{className: "bg-blue-500/10 shadow-none !text-blue-500"}}
              >
                <Tab
                    value="all"
                    onClick={() => setActiveTab("all")}
                    className={activeTab === "all" ? "text-blue-600 font-bold" : ""}
                >
                  전체 상품
                </Tab>
                <Tab
                    value="fixed"
                    onClick={() => setActiveTab("fixed")}
                    className={activeTab === "fixed" ? "text-blue-600 font-bold" : ""}
                >
                  일반 판매
                </Tab>
                <Tab
                    value="auction"
                    onClick={() => setActiveTab("auction")}
                    className={activeTab === "auction" ? "text-blue-600 font-bold" : ""}
                >
                  경매 상품
                </Tab>
              </TabsHeader>
            </Tabs>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-10">
          <ProductFilter/>

          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 2xl:grid-cols-10 gap-4 mb-10">
            {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                  표시할 상품이 없습니다.
                </div>
            )}
          </div>

          {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-8">
                <Pagination
                    active={activePage}
                    total={totalPages}
                    onChange={setActivePage}
                />
              </div>
          )}
        </div>
      </div>
  );
};

export default HomePage;