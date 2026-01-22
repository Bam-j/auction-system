import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Input, Button,
} from "@material-tailwind/react";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
    // TODO: 백엔드 회원가입 API 연동
    console.log("회원가입 정보:", formData);
    alert("회원가입 성공! 로그인해주세요.");
    navigate("/login");
  };

  return (
      <Card className="w-96 shadow-lg">
        <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            회원가입
          </Typography>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardBody className="flex flex-col gap-4">
            <Input
                label="닉네임"
                size="lg"
                name="nickname"
                onChange={handleChange}
            />
            <Input
                label="이메일 (ID)"
                size="lg"
                type="email"
                name="email"
                onChange={handleChange}
            />
            <Input
                label="비밀번호"
                size="lg"
                type="password"
                name="password"
                onChange={handleChange}
            />
            <Input
                label="비밀번호 확인"
                size="lg"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                error={formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0}
            />
          </CardBody>

          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">
              가입하기
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              이미 계정이 있으신가요?
              <Link to="/login">
                <Typography
                    as="span"
                    variant="small"
                    color="blue"
                    className="ml-1 font-bold cursor-pointer hover:underline"
                >
                  로그인
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
  );
};

export default SignupForm;