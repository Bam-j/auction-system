import React from "react";
import SideNavLayout from "../components/SideNavLayout";
import {
  UserCircleIcon, ShoppingBagIcon,
  CurrencyDollarIcon, CubeIcon,
} from "@heroicons/react/24/outline";

const MyPage = () => {
  const myPageMenus = [
    {name: "테스트 문구", path: "", icon: UserCircleIcon},
  ];

  return <SideNavLayout title="마이 페이지" menuItems={myPageMenus}/>;
};

export default MyPage;