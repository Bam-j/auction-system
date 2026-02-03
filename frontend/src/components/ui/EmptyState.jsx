import React from "react";
import {Typography} from "@material-tailwind/react";
import {CubeTransparentIcon} from "@heroicons/react/24/outline";

const EmptyState = ({message = "데이터가 존재하지 않습니다."}) => {
  return (
      <div
          className="flex flex-col items-center justify-center py-12 text-gray-500 gap-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <CubeTransparentIcon className="h-12 w-12 opacity-50"/>
        <Typography variant="h6" color="blue-gray" className="font-normal opacity-70">
          {message}
        </Typography>
      </div>
  );
};

export default EmptyState;