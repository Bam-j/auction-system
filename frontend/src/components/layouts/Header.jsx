import {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {Navbar, Typography, Button} from "@material-tailwind/react";
import {logoutUser} from "@/features/auth/api/authApi.js";
import {PlusIcon} from "@heroicons/react/24/outline";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn("로그아웃 처리 중 서버 에러(무시 가능):", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      setUser(null);
      navigate("/");
    }
  };

  return (
      <Navbar className="mx-auto w-full px-4 py-3 rounded-none shadow-md bg-white border-none">
        <div className="flex items-center justify-between text-blue-gray-900">

          <Typography
              as={Link}
              to="/"
              variant="h5"
              className="mr-2 cursor-pointer py-1.5 font-bold text-font-blue whitespace-nowrap"
          >
            어비스 거래소
          </Typography>

          <div className="flex items-center gap-2">

            {!user ? (
                <Button
                    className="bg-primary text-font-white whitespace-nowrap"
                    onClick={() => navigate('/login')}
                >
                  <span>로그인</span>
                </Button>
            ) : (
                <div className="flex items-center gap-2">
                  <Typography
                      className="mr-1 text-font-main font-medium hidden md:block whitespace-nowrap"
                  >
                    {user.nickname}님
                  </Typography>

                  {user.role !== 'ADMIN' && (
                      <Button
                          className="bg-success hover:bg-success-dark text-font-white flex items-center gap-1 px-3 whitespace-nowrap"
                          onClick={() => navigate('/products/register')}
                      >
                        <PlusIcon strokeWidth={2} className="h-4 w-4"/>
                        <span className="hidden sm:inline">상품 등록</span>
                      </Button>
                  )}

                  {user.role === 'ADMIN' ? (
                      <Button
                          variant="text"
                          className="text-font-main whitespace-nowrap px-3"
                          onClick={() => navigate('/admin')}
                      >
                        관리자 페이지
                      </Button>
                  ) : (
                      <Button
                          variant="text"
                          className="text-font-main whitespace-nowrap px-3"
                          onClick={() => navigate('/mypage')}
                      >
                        마이페이지
                      </Button>
                  )}

                  <Button
                      className="bg-danger hover:bg-danger-dark text-white whitespace-nowrap px-3"
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
