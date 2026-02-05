import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {login} from "../api/authApi";
import {
  Card, CardBody, CardFooter,
  Typography, Input, Checkbox, Button,
} from "@material-tailwind/react";
import CommonModal from "../../../components/ui/CommonModal";

const LoginForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [openContactModal, setOpenContactModal] = useState(false);
  const handleOpenContact = () => setOpenContactModal(!openContactModal);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const loginData = {userId, password};
      const response = await login(loginData);

      const userInfo = {
        userId: userId,
        nickname: response.nickname || userId,
        role: userId === "admin" ? "ADMIN" : "USER",
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      alert(`${userId}님 환영합니다!`);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("로그인 실패:", error);
      const message =
          error.response?.data?.message ||
          "아이디 또는 비밀번호가 일치하지 않습니다.";
      alert(message);
    }
  };

  return (
      <>
        <Card className="w-96 shadow-lg">
          <Typography
              variant="h3"
              color="blue"
              className="mt-3 mb-3 grid h-20 place-items-center"
          >
            로그인
          </Typography>

          <form onSubmit={handleLogin}>
            <CardBody className="flex flex-col gap-4">
              <Input
                  label="아이디"
                  size="lg"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
              />
              <Input
                  label="비밀번호"
                  size="lg"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <div className="-ml-2.5">
                <Checkbox label="로그인 상태 유지"/>
              </div>
            </CardBody>

            <CardFooter className="pt-0">
              <Button variant="gradient" fullWidth type="submit">
                로그인
              </Button>

              <Typography variant="small" className="mt-6 flex justify-center">
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
              디스코드 문의 탭 티켓으로 넣어주세요.
            </Typography>
          </div>
        </CommonModal>
      </>
  );
};

export default LoginForm;