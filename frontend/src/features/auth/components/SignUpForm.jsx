import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Input, Button,
} from "@material-tailwind/react";

import {signup} from "../api/authApi";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value, allData = formData) => {
    let errorMessage = "";
    switch (name) {
      case "username":
        if (!/^[a-zA-Z0-9]{7,}$/.test(value)) {
          errorMessage = "7자 이상, 영문 대소문자와 숫자만 사용 가능합니다.";
        }
        break;
      case "nickname":
        if (!/^[a-zA-Z_]+$/.test(value)) {
          errorMessage = "영문과 언더바(_)만 사용 가능합니다.";
        }
        break;
      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_#.+^=])[A-Za-z\d@$!%*?&\-_#.+^=]{8,}$/;
        if (!passwordRegex.test(value)) {
          errorMessage = "8자 이상, 대/소문자/숫자/특수문자를 모두 포함해야 합니다.";
        }
        break;
      case "confirmPassword":
        const passwordToCompare = name === "confirmPassword" ? allData.password : value;
        const confirmToCompare = name === "confirmPassword" ? value : allData.confirmPassword;
        if (passwordToCompare !== confirmToCompare && confirmToCompare.length > 0) {
          errorMessage = "비밀번호가 일치하지 않습니다.";
        }
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    const newData = {...formData, [name]: value};
    setFormData(newData);
    const errorMsg = validateField(name, value, newData);
    setErrors((prev) => ({...prev, [name]: errorMsg}));
    if (name === "password") {
      const confirmMsg = newData.confirmPassword ? (value !== newData.confirmPassword ? "비밀번호가 일치하지 않습니다." : "") : "";
      setErrors((prev) => ({...prev, confirmPassword: confirmMsg}));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const usernameError = validateField("username", formData.username);
    const nicknameError = validateField("nickname", formData.nickname);
    const passwordError = validateField("password", formData.password);
    const confirmError = formData.password !== formData.confirmPassword ? "비밀번호가 일치하지 않습니다." : "";

    if (usernameError || nicknameError || passwordError || confirmError ||
        !formData.username || !formData.nickname || !formData.password) {
      setErrors({username: usernameError, nickname: nicknameError, password: passwordError, confirmPassword: confirmError});
      alert("입력 정보를 다시 확인해주세요.");
      return;
    }

    try {
      const requestData = {
        username: formData.username,
        nickname: formData.nickname,
        password: formData.password
      };

      await signup(requestData);

      alert("회원가입 성공! 로그인해주세요.");
      navigate("/login");

    } catch (error) {
      console.error("회원가입 실패:", error);

      const serverMessage = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      alert(serverMessage);
    }
  };

  return (
      <Card className="w-96 shadow-lg">
        <Typography variant="h3" color="blue" className="mt-3 mb-3 grid h-20 place-items-center">
          회원가입
        </Typography>

        <form onSubmit={handleSignup}>
          <CardBody className="flex flex-col gap-4">
            <div>
              <Input label="아이디" size="lg" name="username" value={formData.username} onChange={handleChange}
                     error={!!errors.username}/>
              {errors.username &&
                  <Typography variant="small" color="red" className="mt-1 text-xs ml-1">{errors.username}</Typography>}
            </div>
            <div>
              <Input label="닉네임" size="lg" name="nickname" value={formData.nickname} onChange={handleChange}
                     error={!!errors.nickname}/>
              {errors.nickname &&
                  <Typography variant="small" color="red" className="mt-1 text-xs ml-1">{errors.nickname}</Typography>}
            </div>
            <div>
              <Input label="비밀번호" size="lg" type="password" name="password" value={formData.password}
                     onChange={handleChange} error={!!errors.password}/>
              {errors.password &&
                  <Typography variant="small" color="red" className="mt-1 text-xs ml-1">{errors.password}</Typography>}
            </div>
            <div>
              <Input label="비밀번호 확인" size="lg" type="password" name="confirmPassword" value={formData.confirmPassword}
                     onChange={handleChange} error={!!errors.confirmPassword}/>
              {errors.confirmPassword && <Typography variant="small" color="red"
                                                     className="mt-1 text-xs ml-1">{errors.confirmPassword}</Typography>}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit">가입하기</Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              이미 계정이 있으신가요?
              <Link to="/login">
                <Typography as="span" variant="small" color="blue"
                            className="ml-1 font-bold cursor-pointer hover:underline">로그인</Typography>
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
  );
};

export default SignupForm;