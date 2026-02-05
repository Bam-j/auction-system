import React from "react";
import {Chip} from "@material-tailwind/react";

const STATUS_CONFIG = {
  SELLING: {color: "green", label: "판매중"},
  SOLD_OUT: {color: "blue-gray", label: "판매완료"},
  AUCTION: {color: "blue", label: "경매중"},
  BLOCKED: {color: "red", label: "판매중지"},

  WIN: {color: "green", label: "낙찰 성공"},
  LOSE: {color: "red", label: "패찰"},
  ING: {color: "blue", label: "입찰 진행"},

  ACTIVE: {color: "green", label: "정상"},
  BANNED: {color: "red", label: "차단됨"}
};

const StatusBadge = ({status}) => {
  const config = STATUS_CONFIG[status] || {color: "gray", label: status};

  return (
      <Chip
          size="sm"
          variant="ghost"
          value={config.label}
          color={config.color}
          className="w-max rounded-full px-2 py-1"
      />
  );
};

export default StatusBadge;