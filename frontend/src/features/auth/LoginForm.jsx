import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Input, Checkbox, Button,
} from "@material-tailwind/react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    //TODO: 백엔드 로그인 API 연동
    console.log("로그인 시도:", email, password);
    navigate("/");  //임시 홈 이동
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
                label="이메일 (ID)"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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