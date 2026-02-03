import React from "react";
import {Typography} from "@material-tailwind/react";

const PriceTag = ({price, unit = "원", className = ""}) => {
  const formattedPrice = Number(price || 0).toLocaleString();

  return (
      <Typography
          variant="small"
          className={`font-medium text-gray-900 flex items-center gap-1 ${className}`}
      >
        {formattedPrice}
        <span className="text-gray-500 text-xs">{unit}</span>
      </Typography>
  );
};

export default PriceTag;