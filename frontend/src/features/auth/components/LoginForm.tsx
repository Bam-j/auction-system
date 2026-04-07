import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';

import {Card, CardBody, CardFooter, Typography, Input, Button} from '@material-tailwind/react';
import {errorAlert} from '@/utils/swalUtils';

//절대 경로 모듈
import CommonModal from '@/components/ui/CommonModal';
import {User, LoginRequest} from '@/types/auth';

//auth 도메인 내부 api
import {loginUser} from '../api/authApi';


interface LoginFormProps {
  onLoginSuccess: (user: User, accessToken: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLoginSuccess}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginRequest>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [openContactModal, setOpenContactModal] = useState(false);

  const handleOpenContact = () => setOpenContactModal(!openContactModal);

  const onSubmit = async (data: LoginRequest) => {
    try {
      const res = await loginUser(data);
      const {user, accessToken} = res.data;

      onLoginSuccess(user, accessToken);

    } catch (error: any) {
      console.error('로그인 실패:', error);
      const message = error.response?.data?.message || '아이디 또는 비밀번호가 일치하지 않습니다.';
      errorAlert('로그인 실패', message);
    }
  };

  return (
      <>
        <Card className='w-96 shadow-lg bg-white'>
          <Typography variant='h3' color='blue' className='mt-6 mb-2 grid h-16 place-items-center font-bold'>
            로그인
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className='mt-4 mb-2 w-80 max-w-screen-lg sm:w-96'>
            <CardBody className='flex flex-col gap-6'>
              <div>
                <Input
                    size='lg'
                    label='아이디'
                    error={!!errors.username}
                    crossOrigin={undefined}
                    {...register('username', {required: '아이디를 입력해주세요.'})}
                />
                {errors.username && (
                    <Typography variant='small' color='red' className='mt-1 text-xs ml-1'>
                      ⚠️ {errors.username.message}
                    </Typography>
                )}
              </div>
              <div>
                <Input
                    type='password'
                    size='lg'
                    label='비밀번호'
                    error={!!errors.password}
                    crossOrigin={undefined}
                    {...register('password', {required: '비밀번호를 입력해주세요.'})}
                />
                {errors.password && (
                    <Typography variant='small' color='red' className='mt-1 text-xs ml-1'>
                      ⚠️ {errors.password.message}
                    </Typography>
                )}
              </div>
            </CardBody>

            <CardFooter className='pt-0'>
              <Button variant='gradient' fullWidth type='submit' color='blue'>
                로그인
              </Button>

              <Typography variant='small' className='mt-6 flex justify-center text-blue-gray-500'>
                계정이 없으신가요?
                <Link to='/signup'>
                  <Typography as='span' variant='small' color='blue'
                              className='ml-1 font-bold cursor-pointer hover:underline'>
                    회원가입
                  </Typography>
                </Link>
              </Typography>

              <div className='flex justify-center border-t border-gray-200 pt-4 mt-4'>
                <Typography variant='small' className='text-gray-600 font-normal'>
                  아이디 또는 비밀번호를 잊으셨나요?{' '}
                  <span className='text-blue-500 font-bold cursor-pointer hover:underline ml-1'
                        onClick={handleOpenContact}>
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
            title='아이디 및 비밀번호 찾기 문의'
            size='xs'
            footer={
              <div className='flex justify-end w-full'>
                <Button variant='gradient' color='blue-gray' onClick={handleOpenContact}>
                  닫기
                </Button>
              </div>
            }
        >
          <div className='py-4 text-center'>
            <Typography className='text-gray-800 font-medium'>
              공식 디스코드 문의 티켓으로 문의해주세요.
            </Typography>
            <Typography className='mt-2'>
              <a
                  href='https://discord.gg/QZF8HHZk'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 font-bold hover:underline'
              >
                공식 디스코드 바로가기
              </a>
            </Typography>
          </div>
        </CommonModal>
      </>
  );
};

export default LoginForm;
