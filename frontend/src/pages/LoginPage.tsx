import {useNavigate} from 'react-router-dom';

import LoginForm from '@/features/auth/components/LoginForm';
import useAuthStore from '@/stores/useAuthStore';
import {User} from '@/types/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLoginSuccess = (userData: User, accessToken: string, refreshToken: string) => {
    login(userData, accessToken, refreshToken);
    navigate('/');
  };

  return (
      <div className='flex justify-center items-center mt-10'>
        <LoginForm onLoginSuccess={handleLoginSuccess}/>
      </div>
  );
};

export default LoginPage;
