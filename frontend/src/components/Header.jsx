import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Typography, Button } from "@material-tailwind/react";
import { logoutUser } from "../features/auth/api/authApi";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  //TODO: 구조 완성 후 전역 상태 관리 적용하기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await logoutUser();

    localStorage.removeItem("user");
    setUser(null);

    alert("로그아웃 되었습니다.");
    navigate("/");
    window.location.reload();
  };

  return (
      <Navbar className="mx-auto max-w-screen-xl px-4 py-3 rounded-none shadow-md bg-white border-none">
        <div className="flex items-center justify-between text-blue-gray-900">

          <Typography
              as={Link}
              to="/"
              variant="h5"
              className="mr-4 cursor-pointer py-1.5 font-bold text-blue-600"
          >
            MC Auction
          </Typography>

          <div className="flex items-center gap-4">

            {!user ? (
                <Button
                    variant="gradient"
                    size="sm"
                    color="blue"
                    className="hidden lg:inline-block"
                    onClick={() => navigate('/login')}
                >
                  <span>로그인</span>
                </Button>
            ) : (
                <div className="flex items-center gap-2">
                  <Typography variant="small" color="gray" className="mr-2 font-medium hidden md:block">
                    {user.nickname}님
                  </Typography>

                  {user.role === 'ADMIN' ? (
                      <Button
                          variant="text"
                          size="sm"
                          color="blue-gray"
                          onClick={() => navigate('/admin')}
                      >
                        관리자 페이지
                      </Button>
                  ) : (
                      <Button
                          variant="text"
                          size="sm"
                          color="blue-gray"
                          onClick={() => navigate('/mypage')}
                      >
                        마이 페이지
                      </Button>
                  )}

                  <Button
                      variant="outlined"
                      size="sm"
                      color="red"
                      className="hidden lg:inline-block border-red-200"
                      onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </div>
            )}

          </div>
        </div>
      </Navbar>
  );
};

export default Header;