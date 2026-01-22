import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            {/* TODO: element 설정하기 */}
            <Route path="/" element={<div className="text-center text-2xl">🏠 홈 페이지</div>}/>
            <Route path="/login" element={<div>🔑 로그인 페이지</div>}/>
            <Route path="/mypage" element={<div>👤 마이 페이지</div>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;