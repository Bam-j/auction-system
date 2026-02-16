import {useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {
  Card, CardBody, CardFooter,
  Typography, Input, Button,
} from "@material-tailwind/react";
import CommonModal from "../../../components/ui/CommonModal";
import Swal from "sweetalert2";

const LoginForm = ({onLoginSuccess}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openContactModal, setOpenContactModal] = useState(false);

  const handleOpenContact = () => setOpenContactModal(!openContactModal);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "아이디와 비밀번호를 모두 입력해주세요.",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
        username: username,
        password: password
      });

      const {user, accessToken} = res.data;
      const userInfo = {
        username: username,
        nickname: user.nickname,
        role: user.role,
      };

      onLoginSuccess(userInfo, accessToken);

    } catch (error) {
      console.error("로그인 실패:", error);

      const message = error.response?.data?.message || "아이디 또는 비밀번호가 일치하지 않습니다.";

      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: message,
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
      <>
        <Card className="w-96 shadow-lg bg-white">
          <Typography
              variant="h3"
              color="blue"
              className="mt-6 mb-2 grid h-16 place-items-center font-bold"
          >
            로그인
          </Typography>

          <form onSubmit={handleLogin} className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96">
            <CardBody className="flex flex-col gap-6">
              <Input
                  size="lg"
                  label="아이디"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  crossOrigin={undefined}
              />
              <Input
                  type="password"
                  size="lg"
                  label="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  crossOrigin={undefined}
              />
            </CardBody>

            <CardFooter className="pt-0">
              <Button variant="gradient" fullWidth type="submit" color="blue">
                로그인
              </Button>

              <Typography variant="small" className="mt-6 flex justify-center text-blue-gray-500">
                계정이 없으신가요?
                <Link to="/signup">
                  <Typography
                      as="span"
                      variant="small"
                      color="blue"
                      className="ml-1 font-bold cursor-pointer hover:underline"
                  >
                    회원가입
                  </Typography>
                </Link>
              </Typography>

              <div className="flex justify-center border-t border-gray-200 pt-4 mt-4">
                <Typography variant="small" className="text-gray-600 font-normal">
                  아이디 또는 비밀번호를 잊으셨나요?{" "}
                  <span
                      className="text-blue-500 font-bold cursor-pointer hover:underline ml-1"
                      onClick={handleOpenContact}
                  >
                  문의하기
                </span>
                </Typography>
              </div>
            </CardFooter>
          </form>
        </Card>

        <CommonModal
            open={openContactModal}
            handleOpen={handleOpenContact}
            title="계정 찾기 문의"
            size="xs"
            footer={
              <div className="flex justify-end w-full">
                <Button
                    variant="gradient"
                    color="blue-gray"
                    onClick={handleOpenContact}
                >
                  닫기
                </Button>
              </div>
            }
        >
          <div className="py-4 text-center">
            <Typography className="text-gray-800 font-medium">
              디스코드 문의 티켓으로 문의해주세요.
            </Typography>
          </div>
        </CommonModal>
      </>
  );
};

export default LoginForm;
