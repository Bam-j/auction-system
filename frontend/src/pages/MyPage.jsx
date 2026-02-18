import React from "react";
import SideNavLayout from "../components/layouts/SideNavLayout.jsx";
import {
  UserCircleIcon, ShoppingBagIcon,
  CurrencyDollarIcon, CubeIcon, BellAlertIcon
} from "@heroicons/react/24/outline";

const MyPage = () => {
  const myPageMenus = [
    {name: "내 판매 상품", path: "/mypage/products", icon: CubeIcon},
    {name: "판매 요청 관리", path: "/mypage/requests", icon: BellAlertIcon},
    {name: "구매 기록", path: "/mypage/purchases", icon: ShoppingBagIcon},
    {name: "입찰 기록", path: "/mypage/bids", icon: CurrencyDollarIcon},
    {name: "내 정보 수정", path: "/mypage/profile", icon: UserCircleIcon},
  ];

  return <SideNavLayout title="마이 페이지" menuItems={myPageMenus}/>;
};

export default MyPage;