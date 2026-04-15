import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';

import {Card, CardBody, CardFooter, Typography, Input, Button} from '@material-tailwind/react';
import {successAlert, errorAlert, warningAlert} from '@/utils/swalUtils';

//절대 경로 모듈
import {VALIDATION_PATTERNS, VALIDATION_MESSAGES} from '@/utils/validation';
import {SignupRequest} from '@/types/auth';

//auth 도메인 내부 api
import {signup, checkUsername, checkNickname} from '../api/authApi';

interface SignUpFormValues extends SignupRequest {
  confirmPassword: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: {errors},
  } = useForm<SignUpFormValues>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const username = watch('username');
  const nickname = watch('nickname');

  const handleCheckUsername = async () => {
    const currentUsername = getValues('username');
    if (errors.username || !currentUsername) {
      warningAlert('알림', '유효한 아이디를 먼저 입력해주세요.');
      return;
    }
    try {
      await checkUsername(currentUsername);
      successAlert('확인 완료', '사용 가능한 아이디입니다.');
      setIsUsernameChecked(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || '이미 사용 중인 아이디입니다.';
      errorAlert('사용 불가', msg);
      setIsUsernameChecked(false);
    }
  };

  const handleCheckNickname = async () => {
    const currentNickname = getValues('nickname');
    if (errors.nickname || !currentNickname) {
      warningAlert('알림', '유효한 닉네임을 먼저 입력해주세요.');
      return;
    }
    try {
      await checkNickname(currentNickname);
      successAlert('확인 완료', '사용 가능한 닉네임입니다.');
      setIsNicknameChecked(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || '이미 사용 중인 닉네임입니다.';
      errorAlert('사용 불가', msg);
      setIsNicknameChecked(false);
    }
  };

  const onSubmit = async (data: SignUpFormValues) => {
    if (!isUsernameChecked || !isNicknameChecked) {
      warningAlert('중복 확인 필요', '아이디와 닉네임 중복 확인을 완료해주세요.');
      return;
    }

    try {
      const requestData = {
        username: data.username,
        nickname: data.nickname,
        password: data.password
      };

      await signup(requestData);

      successAlert('회원가입 성공!', '로그인 페이지로 이동합니다.').then(() => {
        navigate('/login');
      });

    } catch (error: any) {
      console.error('회원가입 실패:', error);
      const serverMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      errorAlert('가입 실패', serverMessage);
    }
  };

  return (
      <Card className='w-96 shadow-lg bg-surface border border-border'>
        <Typography variant='h3' className='mt-6 mb-2 grid h-16 place-items-center font-bold text-primary'>
          회원가입
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className='mt-4 mb-2 w-80 max-w-screen-lg sm:w-96'>
          <CardBody className='flex flex-col gap-4'>
            <div>
              <div className='flex gap-2'>
                <Input
                    label='아이디'
                    size='lg'
                    error={!!errors.username}
                    crossOrigin={undefined}
                    className='dark:text-font-main'
                    labelProps={{
                      className: 'dark:text-font-sub',
                    }}
                    {...register('username', {
                      required: '아이디를 입력해주세요.',
                      pattern: {
                        value: VALIDATION_PATTERNS.username,
                        message: VALIDATION_MESSAGES.username,
                      },
                      onChange: () => setIsUsernameChecked(false),
                    })}
                />
                <Button
                    variant='outlined'
                    size='sm'
                    color='blue'
                    className='shrink-0 dark:border-border dark:text-primary'
                    onClick={handleCheckUsername}
                    disabled={!username || !!errors.username}
                >
                  중복 확인
                </Button>
              </div>
              {errors.username ? (
                  <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                    ⚠️ {errors.username.message}
                  </Typography>
              ) : (
                  isUsernameChecked &&
                  <Typography variant='small' color='green' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                    ✅ 확인 완료
                  </Typography>
              )}
            </div>

            <div>
              <div className='flex gap-2'>
                <Input
                    label='닉네임'
                    size='lg'
                    error={!!errors.nickname}
                    crossOrigin={undefined}
                    className='dark:text-font-main'
                    labelProps={{
                      className: 'dark:text-font-sub',
                    }}
                    {...register('nickname', {
                      required: '닉네임을 입력해주세요.',
                      pattern: {
                        value: VALIDATION_PATTERNS.nickname,
                        message: VALIDATION_MESSAGES.nickname,
                      },
                      onChange: () => setIsNicknameChecked(false),
                    })}
                />
                <Button
                    variant='outlined'
                    size='sm'
                    color='blue'
                    className='shrink-0 dark:border-border dark:text-primary'
                    onClick={handleCheckNickname}
                    disabled={!nickname || !!errors.nickname}
                >
                  중복 확인
                </Button>
              </div>
              {errors.nickname ? (
                  <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                    ⚠️ {errors.nickname.message}
                  </Typography>
              ) : (
                  isNicknameChecked &&
                  <Typography variant='small' color='green' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                    ✅ 확인 완료
                  </Typography>
              )}
            </div>

            <div>
              <Input
                  label='비밀번호'
                  size='lg'
                  type='password'
                  error={!!errors.password}
                  crossOrigin={undefined}
                  className='dark:text-font-main'
                  labelProps={{
                    className: 'dark:text-font-sub',
                  }}
                  {...register('password', {
                    required: '비밀번호를 입력해주세요.',
                    pattern: {
                      value: VALIDATION_PATTERNS.password,
                      message: VALIDATION_MESSAGES.password,
                    },
                  })}
              />
              {errors.password && (
                  <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                    ⚠️ {errors.password.message}
                  </Typography>
              )}
            </div>

            <div>
              <Input
                  label='비밀번호 확인'
                  size='lg'
                  type='password'
                  error={!!errors.confirmPassword}
                  crossOrigin={undefined}
                  className='dark:text-font-main'
                  labelProps={{
                    className: 'dark:text-font-sub',
                  }}
                  {...register('confirmPassword', {
                    required: '비밀번호 확인을 입력해주세요.',
                    validate: (value) => value === watch('password') || VALIDATION_MESSAGES.confirmPassword,
                  })}
              />
              {errors.confirmPassword && (
                  <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                    ⚠️ {errors.confirmPassword.message}
                  </Typography>
              )}
            </div>
          </CardBody>
          <CardFooter className='pt-0'>
            <Button variant='gradient' fullWidth type='submit' color='blue'>
              가입하기
            </Button>
            <Typography variant='small' className='mt-6 flex justify-center text-font-sub'>
              이미 계정이 있으신가요?
              <Link to='/login'>
                <Typography as='span' variant='small' color='blue' className='ml-1 font-bold cursor-pointer hover:underline'>
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
