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
    await logoutUser();
    localStorage.removeItem("user");
    setUser(null);
    alert("로그아웃 되었습니다.");
    navigate("/");
    window.location.reload();
  };

  return (
      <Navbar className="mx-auto w-full px-4 py-3 rounded-none shadow-md bg-white border-none">
        <div className="flex items-center justify-between text-blue-gray-900">

          <Typography
              as={Link}
              to="/"
              variant="h5"
              className="mr-2 cursor-pointer py-1.5 font-bold text-blue-600 whitespace-nowrap"
          >
            어비스 거래소
          </Typography>

          <div className="flex items-center gap-2">

            {!user ? (
                <Button
                    variant="gradient"
                    size="sm"
                    color="blue"
                    className="whitespace-nowrap"
                    onClick={() => navigate('/login')}
                >
                  <span>로그인</span>
                </Button>
            ) : (
                <div className="flex items-center gap-2">
                  <Typography
                      variant="small"
                      color="gray"
                      className="mr-1 font-medium hidden md:block whitespace-nowrap"
                  >
                    {user.nickname}님
                  </Typography>

                  <Button
                      variant="gradient"
                      size="sm"
                      color="green"
                      className="flex items-center gap-1 px-3 whitespace-nowrap"
                      onClick={() => navigate('/')}
                  >
                    <PlusIcon strokeWidth={2} className="h-4 w-4"/>
                    <span className="hidden sm:inline">상품 등록</span>
                  </Button>

                  {user.role === 'ADMIN' ? (
                      <Button
                          variant="text"
                          size="sm"
                          color="blue-gray"
                          className="whitespace-nowrap px-3"
                          onClick={() => navigate('/admin')}
                      >
                        관리자
                      </Button>
                  ) : (
                      <Button
                          variant="text"
                          size="sm"
                          color="blue-gray"
                          className="whitespace-nowrap px-3"
                          onClick={() => navigate('/mypage')}
                      >
                        마이페이지
                      </Button>
                  )}

                  <Button
                      variant="outlined"
                      size="sm"
                      color="red"
                      className="border-red-200 whitespace-nowrap px-3"
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
