import {Input, Select, Option} from "@material-tailwind/react";

const CATEGORIES = [
  "WEAPON", "ARMOR", "TOOL", "COSMETIC", "TITLE",
  "BLOCK", "REDSTONE_DEVICES", "ORE", "GROWTH_GOODS", "ETC"
];

const CommonProductForm = ({formData, handleChange, handleCategoryChange}) => {
  return (
      <div className="grid grid-cols-1 gap-6">
        <Input
            label="상품명"
            name="product_name"
            size="lg"
            value={formData.product_name}
            onChange={handleChange}
            className="!text-lg"
        />

        <Select
            label="카테고리 분류"
            value={formData.category}
            onChange={handleCategoryChange}
            size="lg"
        >
          {CATEGORIES.map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>
      </div>
  );
};

export default CommonProductForm;
