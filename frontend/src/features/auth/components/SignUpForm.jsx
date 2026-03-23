import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {Card, CardBody, CardFooter, Typography, Input, Button} from "@material-tailwind/react";
import {successAlert, errorAlert, warningAlert} from "@/utils/swalUtils.js";

//절대 경로 모듈
import {validateField} from "@/utils/validation.js";

//auth 도메인 내부 api
import {signup, checkUsername, checkNickname} from "../api/authApi";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    const newData = {...formData, [name]: value};
    setFormData(newData);

    const errorMsg = validateField(name, value, newData);
    setErrors((prev) => ({...prev, [name]: errorMsg}));

    if (name === "username") {
      setIsUsernameChecked(false);
    }
    if (name === "nickname") {
      setIsNicknameChecked(false);
    }

    if (name === "password" && newData.confirmPassword) {
      const confirmMsg = validateField("confirmPassword", newData.confirmPassword, newData);
      setErrors((prev) => ({...prev, confirmPassword: confirmMsg}));
    }
  };

  const handleCheckUsername = async () => {
    if (errors.username || !formData.username) {
      warningAlert("알림", "유효한 아이디를 먼저 입력해주세요.");
      return;
    }
    try {
      await checkUsername(formData.username);

      successAlert("확인 완료", "사용 가능한 아이디입니다.");
      setIsUsernameChecked(true);
    } catch (error) {
      const msg = error.response?.data?.message || "이미 사용 중인 아이디입니다.";
      errorAlert("사용 불가", msg);
      setIsUsernameChecked(false);
    }
  };

  const handleCheckNickname = async () => {
    if (errors.nickname || !formData.nickname) {
      warningAlert("알림", "유효한 닉네임을 먼저 입력해주세요.");
      return;
    }
    try {
      await checkNickname(formData.nickname);

      successAlert("확인 완료", "사용 가능한 닉네임입니다.");
      setIsNicknameChecked(true);
    } catch (error) {
      const msg = error.response?.data?.message || "이미 사용 중인 닉네임입니다.";
      errorAlert("사용 불가", msg);
      setIsNicknameChecked(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isUsernameChecked || !isNicknameChecked) {
      warningAlert("중복 확인 필요", "아이디와 닉네임 중복 확인을 완료해주세요.");
      return;
    }

    const usernameError = validateField("username", formData.username);
    const nicknameError = validateField("nickname", formData.nickname);
    const passwordError = validateField("password", formData.password);
    const confirmError = validateField("confirmPassword", formData.confirmPassword, formData);

    if (usernameError || nicknameError || passwordError || confirmError ||
        !formData.username || !formData.nickname || !formData.password) {
      setErrors({
        username: usernameError,
        nickname: nicknameError,
        password: passwordError,
        confirmPassword: confirmError
      });
      return;
    }

    try {
      const requestData = {
        username: formData.username,
        nickname: formData.nickname,
        password: formData.password
      };

      await signup(requestData);

      successAlert("회원가입 성공!", "로그인 페이지로 이동합니다.").then(() => {
        navigate("/login");
      });

    } catch (error) {
      console.error("회원가입 실패:", error);
      const serverMessage = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      errorAlert("가입 실패", serverMessage);
    }
  };

  return (
      <Card className="w-96 shadow-lg bg-white">
        <Typography variant="h3" color="blue" className="mt-6 mb-2 grid h-16 place-items-center font-bold">
          회원가입
        </Typography>

        <form onSubmit={handleSignup} className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96">
          <CardBody className="flex flex-col gap-4">
            <div>
              <div className="flex gap-2">
                <Input label="아이디" size="lg" name="username" value={formData.username} onChange={handleChange}
                       error={!!errors.username} crossOrigin={undefined}/>
                <Button variant="outlined" size="sm" color="blue" className="shrink-0"
                        onClick={handleCheckUsername} disabled={!formData.username || !!errors.username}>
                  중복 확인
                </Button>
              </div>
              {errors.username ? (
                  <Typography variant="small" color="red"
                              className="mt-1 text-xs ml-1 flex items-center gap-1">⚠️ {errors.username}</Typography>
              ) : (
                  isUsernameChecked &&
                  <Typography variant="small" color="green" className="mt-1 text-xs ml-1 flex items-center gap-1">✅ 확인
                                                                                                                  완료</Typography>
              )}
            </div>

            <div>
              <div className="flex gap-2">
                <Input label="닉네임" size="lg" name="nickname" value={formData.nickname} onChange={handleChange}
                       error={!!errors.nickname} crossOrigin={undefined}/>
                <Button variant="outlined" size="sm" color="blue" className="shrink-0"
                        onClick={handleCheckNickname} disabled={!formData.nickname || !!errors.nickname}>
                  중복 확인
                </Button>
              </div>
              {errors.nickname ? (
                  <Typography variant="small" color="red"
                              className="mt-1 text-xs ml-1 flex items-center gap-1">⚠️ {errors.nickname}</Typography>
              ) : (
                  isNicknameChecked &&
                  <Typography variant="small" color="green" className="mt-1 text-xs ml-1 flex items-center gap-1">✅ 확인
                                                                                                                  완료</Typography>
              )}
            </div>

            <div>
              <Input label="비밀번호" size="lg" type="password" name="password" value={formData.password}
                     onChange={handleChange} error={!!errors.password} crossOrigin={undefined}/>
              {errors.password && <Typography variant="small" color="red"
                                              className="mt-1 text-xs ml-1 flex items-center gap-1">⚠️ {errors.password}</Typography>}
            </div>
            <div>
              <Input label="비밀번호 확인" size="lg" type="password" name="confirmPassword" value={formData.confirmPassword}
                     onChange={handleChange} error={!!errors.confirmPassword} crossOrigin={undefined}/>
              {errors.confirmPassword && <Typography variant="small" color="red"
                                                     className="mt-1 text-xs ml-1 flex items-center gap-1">⚠️ {errors.confirmPassword}</Typography>}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth type="submit" color="blue">가입하기</Button>
            <Typography variant="small" className="mt-6 flex justify-center text-blue-gray-500">
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
