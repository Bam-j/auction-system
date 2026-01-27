import React from "react";
import SideNavLayout from "../components/SideNavLayout";
import {
  UsersIcon, MegaphoneIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const AdminPage = () => {
  const adminMenus = [
    { name: "테스트 문구(관리자 페이지)", path: "", icon: UsersIcon },
  ];

  return <SideNavLayout title="관리자 센터" menuItems={adminMenus} />;
};

export default AdminPage;