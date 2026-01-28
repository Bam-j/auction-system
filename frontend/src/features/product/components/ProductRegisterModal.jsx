import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Typography,
} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/outline";

import CommonProductForm from "./forms/CommonProductForm";
import FixedProductForm from "./forms/FixedProductForm";
import AuctionProductForm from "./forms/AuctionProductForm";

const ProductRegisterModal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // 공통 항목
    type: "",
    product_name: "",
    description: "",
    category: "",
    image: null,

    // 일반 판매
    price: "",
    stock: "",

    // 경매
    ended_at: "",
    start_price: "",
    min_bid_increment: "",
    instant_purchase_price: "",
    price_unit: "EMERALD",
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
    // TODO: 백엔드 API 호출
    alert("상품이 등록되었습니다!");
    navigate("/");
  };

  if (step === 1) {
    return (
        <Dialog open={true} handler={handleClose} size="sm" className="p-4">
          <DialogHeader className="justify-between">
            <Typography variant="h5">상품 등록 유형 선택</Typography>
            <XMarkIcon className="h-5 w-5 cursor-pointer" onClick={handleClose}/>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4 py-8">
            <Button
                variant="gradient" color="blue" className="h-24 text-lg"
                onClick={() => {
                  setFormData({...formData, type: "FIXED"});
                  setStep(2);
                }}
            >
              일반 판매 등록
              <Typography variant="small" className="mt-2 opacity-80 font-normal">정해진 가격에 즉시 판매합니다.</Typography>
            </Button>
            <Button
                variant="gradient" color="deep-orange" className="h-24 text-lg"
                onClick={() => {
                  setFormData({...formData, type: "AUCTION"});
                  setStep(2);
                }}
            >
              경매 물품 등록
              <Typography variant="small" className="mt-2 opacity-80 font-normal">입찰을 통해 가장 높은 가격에 판매합니다.</Typography>
            </Button>
          </DialogBody>
        </Dialog>
    );
  }

  return (
      <Dialog open={true} handler={handleClose} size="lg" className="overflow-y-auto max-h-[90vh]">
        <DialogHeader className="justify-between border-b border-gray-200 sticky top-0 bg-white z-10">
          <Typography variant="h5">
            {formData.type === "FIXED" ? "일반 판매 상품 정보 입력" : "경매 물품 정보 입력"}
          </Typography>
          <XMarkIcon className="h-5 w-5 cursor-pointer" onClick={handleClose}/>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-6 p-6">
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
        </DialogBody>

        <DialogFooter className="sticky bottom-0 bg-white z-10 border-t border-gray-200">
          <Button variant="text" color="red" onClick={() => setStep(1)} className="mr-auto">
            이전 단계
          </Button>
          <div className="flex gap-2">
            <Button variant="text" color="blue-gray" onClick={handleClose}>취소</Button>
            <Button variant="gradient" color="green" onClick={handleSubmit}>등록하기</Button>
          </div>
        </DialogFooter>
      </Dialog>
  );
};

export default ProductRegisterModal;