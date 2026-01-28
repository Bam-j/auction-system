import {Input, Select, Option, Textarea} from "@material-tailwind/react";
import {PhotoIcon} from "@heroicons/react/24/outline";

const CATEGORIES = [
  "WEAPON", "ARMOR", "TOOL", "COSMETIC", "TITLE",
  "BLOCK", "REDSTONE_DEVICES", "ORE", "GROWTH_GOODS", "ETC"
];

const CommonProductForm = ({formData, handleChange, handleCategoryChange, handleImageChange}) => {
  return (
      <div className="grid grid-cols-1 gap-6">
        <Input
            label="상품명"
            name="product_name"
            size="lg"
            value={formData.product_name}
            onChange={handleChange}
        />

        <Select
            label="카테고리 분류"
            value={formData.category}
            onChange={handleCategoryChange}
        >
          {CATEGORIES.map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>

        <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-3">
          <PhotoIcon className="h-8 w-8 text-gray-400"/>
          <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-500"
          />
        </div>

        <Textarea
            label="상품 부가 설명 (상태, 옵션 등)"
            name="description"
            value={formData.description}
            onChange={handleChange}
        />
      </div>
  );
};

export default CommonProductForm;