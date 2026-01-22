import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<div className="text-center text-2xl mt-10">홈 페이지</div>}/>

            {/* 로그인 & 회원가입 라우트 연결 */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>

            <Route path="/mypage" element={<div>마이 페이지</div>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;