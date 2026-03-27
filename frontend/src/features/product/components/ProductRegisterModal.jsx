import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {Button, Typography, Textarea} from "@material-tailwind/react";
import {PhotoIcon} from "@heroicons/react/24/outline";

//절대 경로 모듈
import CommonModal from "@/components/ui/CommonModal";
import {successAlert, errorAlert, warningAlert} from "@/utils/swalUtils";
import useAuthStore from "@/stores/useAuthStore";

//product 도메인 내부 api, 자식 컴포넌트
import {registerProduct} from "../api/productApi";
import CommonProductForm from "./forms/CommonProductForm";
import FixedProductForm from "./forms/FixedProductForm";
import AuctionProductForm from "./forms/AuctionProductForm";

const ProductRegisterModal = () => {
  const navigate = useNavigate();
  const {user} = useAuthStore();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    type: "", product_name: "", description: "", category: "", image: null,
    price: "", stock: "",
    ended_at: "", start_price: "", min_bid_increment: "", instant_purchase_price: "", price_unit: "EMERALD",
  });

  const handleClose = () => navigate(-1);

  const checkVerification = () => {
    if (!user) {
      warningAlert("로그인을 해주세요").then(() => navigate("/login"));
      return false;
    }

    if (!user.isVerified) {
      warningAlert("인증이 필요합니다.", "이메일 인증을 완료한 계정만 상품을 등록할 수 있습니다.")
          .then(() => navigate(-1));
      return false;
    }
    return true;
  };

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

  const handleSubmit = async () => {
    if (formData.type === "FIXED") {
      if (Number(formData.stock) < 1) {
        errorAlert("입력 오류", "재고 수량은 1개 이상이어야 합니다.");
        return;
      }
    }

    if (formData.type === "AUCTION") {
      const now = new Date();
      const endedAt = new Date(formData.ended_at);
      if (endedAt <= now) {
        errorAlert("입력 오류", "경매 마감일은 현재 시간 이후여야 합니다.");
        return;
      }
      if (Number(formData.start_price) < 0) {
        errorAlert("입력 오류", "경매 시작가는 0 이상이어야 합니다.");
        return;
      }
      if (Number(formData.min_bid_increment) < 1) {
        errorAlert("입력 오류", "최소 입찰 단위는 1 이상이어야 합니다.");
        return;
      }
      if (formData.instant_purchase_price && Number(formData.instant_purchase_price) < 0) {
        errorAlert("입력 오류", "즉시 구매가는 0 이상이어야 합니다.");
        return;
      }
    }

    try {
      await registerProduct(formData);

      successAlert("상품 등록 완료!", "상품이 성공적으로 등록되었습니다.")
          .then(() => {
            navigate("/");
          });

    } catch (error) {
      console.error("등록 실패 상세:", error.response?.data);

      const serverMessage = error.response?.data?.message || "상품 등록 중 오류가 발생했습니다.";
      const validationErrors = error.response?.data?.validationErrors;

      let errorText = serverMessage;
      if (validationErrors) {
        errorText = Object.values(validationErrors).join("\n");
      }

      errorAlert("등록 실패", errorText);
    }
  };

  if (step === 1) {
    return (
        <CommonModal
            open={true}
            handleOpen={handleClose}
            title="상품 등록 유형 선택"
            size="sm"
        >
          <div className="flex flex-col gap-4 py-4 px-6">
            <Button
                className="h-24 text-lg normal-case bg-primary hover:bg-primary-dark text-white"
                onClick={() => {
                  if (!checkVerification()) return;
                  setFormData({...formData, type: "FIXED"});
                  setStep(2);
                }}
            >
              <div className="flex flex-col items-center">
                <span>일반 판매 등록</span>
                <Typography variant="small" className="mt-1 opacity-70 font-normal text-font-white">
                  정해진 가격에 즉시 판매합니다.
                </Typography>
              </div>
            </Button>

            <Button
                className="h-24 text-lg normal-case bg-warning hover:bg-warning-dark text-white"
                onClick={() => {
                  if (!checkVerification()) return;
                  setFormData({...formData, type: "AUCTION"});
                  setStep(2);
                }}
            >
              <div className="flex flex-col items-center">
                <span>경매 물품 등록</span>
                <Typography variant="small" className="mt-1 opacity-70 font-normal text-font-white">
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
        <div className="flex flex-col gap-6 p-4 max-h-[65vh] overflow-y-auto pr-4">

          {/* 이미지 업로드 섹션 */}
          <div className="flex flex-col gap-3">
            <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
              <PhotoIcon className="h-5 w-5"/> 상품 대표 이미지
            </Typography>
            <div className="flex items-center gap-4 border border-blue-gray-200 rounded-lg p-3 bg-gray-50/50">
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`
                    w-full
                    text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                    file:bg-primary file:text-white hover:file:bg-primary-dark
                    cursor-pointer
                  `}
              />
            </div>
            {formData.image && (
                <Typography variant="small" color="green" className="ml-1">
                  선택된 파일: {formData.image.name}
                </Typography>
            )}
          </div>

          <hr className="border-gray-200"/>

          <CommonProductForm
              formData={formData}
              handleChange={handleChange}
              handleCategoryChange={handleCategoryChange}
          />

          {formData.type === "FIXED" ? (
              <FixedProductForm formData={formData} handleChange={handleChange}/>
          ) : (
              <AuctionProductForm formData={formData} handleChange={handleChange}/>
          )}

          <hr className="border-gray-200"/>

          <div className="flex flex-col gap-3">
            <Typography variant="h6" color="blue-gray">
              상품 상세 설명
            </Typography>
            <Textarea
                label="상품의 상태, 옵션 등을 자세히 적어주세요."
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="lg"
                className="min-h-[120px]"
            />
          </div>
        </div>
      </CommonModal>
  );
};

export default ProductRegisterModal;
