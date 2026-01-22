import {Link, useNavigate} from 'react-router-dom';
import {Navbar, Typography, Button} from "@material-tailwind/react";

const Header = () => {
  const navigate = useNavigate();

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

            <Button
                variant="text"
                size="sm"
                className="hidden lg:inline-block"
                onClick={() => navigate('/mypage')}
            >
              마이 페이지
            </Button>

            <Button
                variant="gradient"
                size="sm"
                color="blue"
                className="hidden lg:inline-block"
                onClick={() => navigate('/login')}
            >
              <span>로그인</span>
            </Button>

          </div>
        </div>
      </Navbar>
  );
};

export default Header;