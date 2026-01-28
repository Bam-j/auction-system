import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Input, Checkbox, Button,
} from "@material-tailwind/react";

import {login} from "../api/authApi";

const LoginForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

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
        role: userId === 'admin' ? 'ADMIN' : 'USER'
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      alert(`${userId}님 환영합니다!`);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("로그인 실패:", error);

      const message = error.response?.data?.message || "아이디 또는 비밀번호가 일치하지 않습니다.";
      alert(message);
    }
  };

  return (
      <Card className="w-96 shadow-lg">
        <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            로그인
          </Typography>
        </CardHeader>

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
          </CardFooter>
        </form>
      </Card>
  );
};

export default LoginForm;