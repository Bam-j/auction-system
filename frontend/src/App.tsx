import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import TitleUpdater from './components/shared/TitleUpdater';

//기본 페이지
import Layout from './components/layouts/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';

//마이 페이지
import MyPage from './pages/MyPage';
import MyProductList from './features/mypage/components/MyProductList';
import MyPurchaseHistory from './features/mypage/components/MyPurchaseHistory';
import MyInstantBuyHistory from './features/mypage/components/MyInstantBuyHistory';
import MyBidHistory from './features/mypage/components/MyBidHistory';
import MyProfileEdit from './features/mypage/components/MyProfileEdit';
import MySalesRequests from './features/mypage/components/MySalesRequests';

//관리자 페이지
import AdminPage from './pages/AdminPage';
import AdminDashboard from './features/admin/components/AdminDashboard';
import AdminProductList from './features/admin/components/AdminProductList';
import AdminPurchaseHistory from './features/admin/components/AdminPurchaseHistory';
import AdminInstantBuyHistory from './features/admin/components/AdminInstantBuyHistory';
import AdminBidHistory from './features/admin/components/AdminBidHistory';
import AdminUserList from './features/admin/components/AdminUserList';

//상품 등록
import ProductRegisterPage from './pages/ProductRegisterPage';

const App = () => {
  return (
      <BrowserRouter>
        <TitleUpdater/>

        <Routes>
          {/* 전체 레이아웃 */}
          <Route element={<Layout/>}>
            {/* 홈페이지 */}
            <Route path="/" element={<HomePage/>}/>

            {/* 로그인 및 회원 가입 */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>

            {/* 마이 페이지 라우팅  */}
            <Route path="/mypage" element={<MyPage/>}>
              <Route index element={<Navigate to="products" replace/>}/>
              <Route path="products" element={<MyProductList/>}/>
              <Route path="requests" element={<MySalesRequests/>}/>
              <Route path="instant-buys" element={<MyInstantBuyHistory/>}/>
              <Route path="purchases" element={<MyPurchaseHistory/>}/>
              <Route path="bids" element={<MyBidHistory/>}/>
              <Route path="profile" element={<MyProfileEdit/>}/>
            </Route>

            {/* 관리자 페이지 라우팅 */}
            <Route path="/admin" element={<AdminPage/>}>
              <Route index element={<Navigate to="dashboard" replace/>}/>
              <Route path="dashboard" element={<AdminDashboard/>}/>
              <Route path="products" element={<AdminProductList/>}/>
              <Route path="instant-buys" element={<AdminInstantBuyHistory/>}/>
              <Route path="purchases" element={<AdminPurchaseHistory/>}/>
              <Route path="bids" element={<AdminBidHistory/>}/>
              <Route path="users" element={<AdminUserList/>}/>
            </Route>

            {/* 상품 등록 라우팅 */}
            <Route path="/products/register" element={<ProductRegisterPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
