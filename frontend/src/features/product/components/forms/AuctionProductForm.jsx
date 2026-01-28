import {Input, Radio, Typography} from "@material-tailwind/react";

const PRICE_UNITS = [
  {value: "EMERALD", label: "에메랄드"},
  {value: "EMERALD_BLOCK", label: "에메랄드 블록"},
  {value: "EMERALD_COIN", label: "에메랄드 주화"},
];

const AuctionProductForm = ({formData, handleChange}) => {
  return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Input
              type="datetime-local"
              label="경매 마감일"
              name="ended_at"
              value={formData.ended_at}
              onChange={handleChange}
              containerProps={{className: "min-w-[72px]"}}
          />
          <Input
              type="number"
              label="경매 시작가"
              name="start_price"
              value={formData.start_price}
              onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
              type="number"
              label="최소 입찰 단위"
              name="min_bid_increment"
              value={formData.min_bid_increment}
              onChange={handleChange}
          />
          <Input
              type="number"
              label="즉시 구매가 (선택)"
              name="instant_purchase_price"
              value={formData.instant_purchase_price}
              onChange={handleChange}
          />
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
            경매/입찰 화폐 단위
          </Typography>
          <div className="flex flex-wrap gap-4">
            {PRICE_UNITS.map((unit) => (
                <Radio
                    key={unit.value}
                    name="price_unit"
                    label={unit.label}
                    value={unit.value}
                    checked={formData.price_unit === unit.value}
                    onChange={handleChange}
                    color="blue"
                />
            ))}
          </div>
        </div>
      </div>
  );
};

export default AuctionProductForm;