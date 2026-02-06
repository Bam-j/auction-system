import {BrowserRouter, Routes, Route} from 'react-router-dom';
import TitleUpdater from './components/shared/TitleUpdater';

//기본 페이지
import Layout from './components/layouts/Layout.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

//마이 페이지
import MyPage from './pages/MyPage';
import MyProductList from './features/mypage/components/MyProductList';
import MyPurchaseHistory from './features/mypage/components/MyPurchaseHistory';
import MyBidHistory from './features/mypage/components/MyBidHistory';
import MyProfileEdit from './features/mypage/components/MyProfileEdit';
import MySalesRequests from './features/mypage/components/MySalesRequests';

//관리자 페이지
import AdminPage from './pages/AdminPage';
import AdminProductList from './features/admin/components/AdminProductList';
import AdminPurchaseHistory from './features/admin/components/AdminPurchaseHistory';
import AdminBidHistory from './features/admin/components/AdminBidHistory';
import AdminUserList from './features/admin/components/AdminUserList';

//상품 등록
import ProductRegisterPage from './pages/ProductRegisterPage';

function App() {
  return (
      <BrowserRouter>
        <TitleUpdater/>

        <Routes>
          {/* 전체 레이아웃 */}
          <Route element={<Layout/>}>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>

            {/* 마이 페이지 라우팅  */}
            <Route path="/mypage" element={<MyPage/>}>
              <Route index path="products" element={<MyProductList/>}/>
              <Route path="requests" element={<MySalesRequests/>}/>
              <Route path="purchases" element={<MyPurchaseHistory/>}/>
              <Route path="bids" element={<MyBidHistory/>}/>
              <Route path="profile" element={<MyProfileEdit/>}/>
            </Route>

            {/* 관리자 페이지 라우팅 */}
            <Route path="/admin" element={<AdminPage/>}>
              <Route index path="products" element={<AdminProductList/>}/>
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