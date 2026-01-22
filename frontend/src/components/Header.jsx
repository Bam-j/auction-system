import { Link } from 'react-router-dom';

const Header = () => {
  return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            MC Auction
          </Link>

          <nav className="flex gap-4">
            <Link
                to="/login"
                className="text-gray-600 hover:text-blue-500 font-medium transition"
            >
              로그인
            </Link>
            <Link
                to="/mypage"
                className="text-gray-600 hover:text-blue-500 font-medium transition"
            >
              마이 페이지
            </Link>
          </nav>
        </div>
      </header>
  );
};

export default Header;