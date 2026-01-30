import {BrowserRouter, Routes, Route} from 'react-router-dom';

//기본 페이지
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

//마이 페이지
import MyPage from './pages/MyPage';
import MyProductList from './features/mypage/components/MyProductList';
import MyPurchaseHistory from './features/mypage/components/MyPurchaseHistory';
import MyBidHistory from './features/mypage/components/MyBidHistory';
import MyProfileEdit from './features/mypage/components/MyProfileEdit';

//관리자 페이지
import AdminPage from './pages/AdminPage';

//상품 등록
import ProductRegisterPage from './pages/ProductRegisterPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* 전체 레이아웃 */}
          <Route element={<Layout/>}>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>

            {/* 마이 페이지 라우팅  */}
            <Route path="/mypage" element={<MyPage/>}>
              <Route index path="products" element={<MyProductList/>}/>
              <Route path="purchases" element={<MyPurchaseHistory/>}/>
              <Route path="bids" element={<MyBidHistory/>}/>
              <Route path="profile" element={<MyProfileEdit/>}/>
            </Route>

            {/* 관리자 페이지 라우팅 */}
            <Route path="/admin" element={<AdminPage/>}>
              <Route index path="products" element={</>}/>
              <Route path="purchases" element={</>}/>
              <Route path="bids" element={</>}/>
              <Route path="users" element={</>}/>
            </Route>

            {/* 상품 등록 라우팅 */}
            <Route path="/products/register" element={<ProductRegisterPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;