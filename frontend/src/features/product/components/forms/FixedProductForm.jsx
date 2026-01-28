import {Input} from "@material-tailwind/react";

const FixedProductForm = ({formData, handleChange}) => {
  return (
      <div className="grid grid-cols-2 gap-6">
        <Input
            type="number"
            label="판매 가격 (에메랄드)"
            name="price"
            value={formData.price}
            onChange={handleChange}
        />
        <Input
            type="number"
            label="재고 수량 (개)"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
        />
      </div>
  );
};

export default FixedProductForm;