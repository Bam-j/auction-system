import {UsersIcon, ClipboardDocumentListIcon, ShoppingBagIcon, CurrencyDollarIcon} from '@heroicons/react/24/outline';

import SideNavLayout from '@/components/layouts/SideNavLayout';
import {MenuItem} from '@/types/navigation';

const AdminPage = () => {
  const adminMenus: MenuItem[] = [
    {name: '회원 관리', path: '/admin/users', icon: UsersIcon},
    {name: '전체 상품 관리', path: '/admin/products', icon: ClipboardDocumentListIcon},
    {name: '전체 즉시 구매 기록', path: '/admin/instant-buys', icon: CurrencyDollarIcon},
    {name: '전체 구매 요청 기록', path: '/admin/purchases', icon: ShoppingBagIcon},
    {name: '전체 입찰 기록', path: '/admin/bids', icon: CurrencyDollarIcon},
  ];

  return <SideNavLayout title='관리 메뉴' menuItems={adminMenus}/>;
};

export default AdminPage;
