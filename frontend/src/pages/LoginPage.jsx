import { useNavigate } from "react-router-dom";
import LoginForm from "../features/auth/components/LoginForm.jsx";
import useAuthStore from "@/stores/useAuthStore"; // 1. 스토어 임포트

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLoginSuccess = (userData, accessToken) => {
    login(userData, accessToken);
    navigate("/");
  };

  return (
      <div className="flex justify-center items-center mt-10">
        <LoginForm onLoginSuccess={handleLoginSuccess}/>
      </div>
  );
};

export default LoginPage;