import React from "react";
import SideNavLayout from "../components/SideNavLayout";
import {
  UserCircleIcon, ShoppingBagIcon,
  CurrencyDollarIcon, CubeIcon,
} from "@heroicons/react/24/outline";

const MyPage = () => {
  const myPageMenus = [
    {name: "내 정보 수정", path: "/mypage", icon: UserCircleIcon},
    {name: "내 판매 상품", path: "/mypage/products", icon: CubeIcon},
    {name: "구매 기록", path: "/mypage/purchases", icon: ShoppingBagIcon},
    {name: "입찰 기록", path: "/mypage/bids", icon: CurrencyDollarIcon},
  ];

  return <SideNavLayout title="마이 페이지" menuItems={myPageMenus}/>;
};

export default MyPage;