import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
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

            {/* 마이 페이지 라우팅 */}
            <Route path="/mypage" element={<MyPage/>}>
              <Route index element={<></>}/>
              <Route path="" element={<></>}/>
            </Route>

            {/* 관리자 페이지 라우팅 */}
            <Route path="/admin" element={<AdminPage/>}>
              <Route index element={<></>}/>
              <Route path="products" element={<></>}/>
            </Route>

            {/* 상품 등록 라우팅 */}
            <Route path="/products/register" element={<ProductRegisterPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;