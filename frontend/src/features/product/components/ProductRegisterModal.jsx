import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Typography} from "@material-tailwind/react";
import CommonModal from "../../../components/ui/CommonModal"; // ★ 공통 모달 임포트

import CommonProductForm from "./forms/CommonProductForm";
import FixedProductForm from "./forms/FixedProductForm";
import AuctionProductForm from "./forms/AuctionProductForm";

const ProductRegisterModal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    type: "", product_name: "", description: "", category: "", image: null,
    price: "", stock: "",
    ended_at: "", start_price: "", min_bid_increment: "", instant_purchase_price: "", price_unit: "EMERALD",
  });

  const handleClose = () => navigate(-1);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };
  const handleCategoryChange = (val) => setFormData((prev) => ({...prev, category: val}));
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({...prev, image: file}));
    }
  };

  const handleSubmit = () => {
    console.log("최종 전송 데이터:", formData);
    alert("상품이 등록되었습니다!");
    navigate("/");
  };

  if (step === 1) {
    return (
        <CommonModal
            open={true}
            handleOpen={handleClose}
            title="상품 등록 유형 선택"
            size="sm"
            // Step 1은 푸터 없음
        >
          <div className="flex flex-col gap-4 py-4">
            <Button
                variant="gradient" color="blue" className="h-24 text-lg normal-case"
                onClick={() => {
                  setFormData({...formData, type: "FIXED"});
                  setStep(2);
                }}
            >
              <div className="flex flex-col items-center">
                <span>일반 판매 등록</span>
                <Typography variant="small" className="mt-1 opacity-70 font-normal">
                  정해진 가격에 즉시 판매합니다.
                </Typography>
              </div>
            </Button>
            <Button
                variant="gradient" color="deep-orange" className="h-24 text-lg normal-case"
                onClick={() => {
                  setFormData({...formData, type: "AUCTION"});
                  setStep(2);
                }}
            >
              <div className="flex flex-col items-center">
                <span>경매 물품 등록</span>
                <Typography variant="small" className="mt-1 opacity-70 font-normal">
                  입찰을 통해 가장 높은 가격에 판매합니다.
                </Typography>
              </div>
            </Button>
          </div>
        </CommonModal>
    );
  }

  return (
      <CommonModal
          open={true}
          handleOpen={handleClose}
          title={formData.type === "FIXED" ? "일반 판매 상품 정보 입력" : "경매 물품 정보 입력"}
          size="lg"
          footer={
            <div className="flex w-full items-center justify-between">
              <Button variant="text" color="red" onClick={() => setStep(1)}>
                이전 단계
              </Button>
              <div className="flex gap-2">
                <Button variant="text" color="blue-gray" onClick={handleClose}>
                  취소
                </Button>
                <Button variant="gradient" color="green" onClick={handleSubmit}>
                  등록하기
                </Button>
              </div>
            </div>
          }
      >
        <div className="flex flex-col gap-6 p-2">
          <CommonProductForm
              formData={formData}
              handleChange={handleChange}
              handleCategoryChange={handleCategoryChange}
              handleImageChange={handleImageChange}
          />

          <hr className="border-gray-200"/>

          {formData.type === "FIXED" ? (
              <FixedProductForm formData={formData} handleChange={handleChange}/>
          ) : (
              <AuctionProductForm formData={formData} handleChange={handleChange}/>
          )}
        </div>
      </CommonModal>
  );
};

export default ProductRegisterModal;