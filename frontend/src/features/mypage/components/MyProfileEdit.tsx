import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';

import {Card, CardHeader, CardBody, Typography, Input, Button} from '@material-tailwind/react';
import {successAlert, errorAlert, warningAlert, infoAlert} from '@/utils/swalUtils';

//절대 경로 모듈
import CommonModal from '@/components/ui/CommonModal';
import {checkNickname} from '@/features/auth/api/authApi';
import useAuthStore from '@/stores/useAuthStore';
import {VALIDATION_PATTERNS, VALIDATION_MESSAGES} from '@/utils/validation';

//도메인 내부 api
import {
  updateMyNickname,
  updateMyPassword,
  sendEmailVerificationCode,
  verifyEmailCode,
  updateEmailVerificationStatus,
  deleteMyAccount
} from '../api/mypageApi';

interface ProfileFormValues {
  nickname: string;
  password: '';
  confirmPassword: '';
  email: string;
  verificationCode: string;
  deletePassword: '';
}

const MyProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const {user, logout, updateNickname, updateEmailVerification} = useAuthStore();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: {errors},
  } = useForm<ProfileFormValues>({
    mode: 'onChange',
    defaultValues: {
      nickname: user?.nickname || '',
      password: '',
      confirmPassword: '',
      email: user?.email || '',
      verificationCode: '',
      deletePassword: '',
    },
  });

  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const nicknameValue = watch('nickname');
  const emailValue = watch('email');
  const passwordValue = watch('password');
  const verificationCodeValue = watch('verificationCode');
  const deletePasswordValue = watch('deletePassword');

  useEffect(() => {
    if (nicknameValue === user?.nickname) {
      setIsNicknameChecked(true);
    } else {
      setIsNicknameChecked(false);
    }
  }, [nicknameValue, user?.nickname]);

  const handleOpenDelete = () => {
    setOpenDeleteModal(!openDeleteModal);
    setValue('deletePassword', '');
  };

  const handleCheckNickname = async () => {
    const currentNickname = getValues('nickname');
    if (errors.nickname || !currentNickname) {
      warningAlert('알림', '유효한 닉네임을 먼저 입력해주세요.');
      return;
    }

    if (currentNickname === user?.nickname) {
      infoAlert('알림', '기존 닉네임과 동일합니다.');
      setIsNicknameChecked(true);
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

  const onNicknameUpdate = async (data: ProfileFormValues) => {
    if (!isNicknameChecked) {
      warningAlert('중복 확인 필요', '닉네임 중복 확인을 완료해주세요.');
      return;
    }

    try {
      await updateMyNickname(data.nickname);
      updateNickname(data.nickname);
      successAlert('성공', '닉네임이 성공적으로 변경되었습니다.');
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || '닉네임 변경에 실패했습니다.';
      errorAlert('실패', serverMessage);
    }
  };

  const onPasswordUpdate = async (data: ProfileFormValues) => {
    try {
      await updateMyPassword(data.password);
      successAlert('성공', '비밀번호가 성공적으로 변경되었습니다.');
      setValue('password', '');
      setValue('confirmPassword', '');
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      errorAlert('실패', serverMessage);
    }
  };

  const handleSendCode = async () => {
    const email = getValues('email');
    if (!email || errors.email) {
      warningAlert('입력 확인', '유효한 이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await sendEmailVerificationCode(email);
      setIsCodeSent(true);
      successAlert('발송 완료', '인증 코드가 이메일로 발송되었습니다.');
    } catch (error: any) {
      console.error('인증 코드 발송 실패:', error);
      const msg = error.response?.data?.message || '이미 가입된 이메일이거나 발송에 실패했습니다.';
      errorAlert('발송 실패', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = getValues('verificationCode');
    const email = getValues('email');
    if (!code) {
      warningAlert('입력 확인', '인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyEmailCode(email, code);
      if (response.data) {
        await updateEmailVerificationStatus(email);
        updateEmailVerification(email);
        successAlert('인증 성공', '이메일 인증이 완료되었습니다.');
        setIsCodeSent(false);
        setValue('verificationCode', '');
      } else {
        errorAlert('인증 실패', '인증 코드가 일치하지 않거나 만료되었습니다.');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || '인증 처리 중 오류가 발생했습니다.';
      errorAlert('오류', msg);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async (data: ProfileFormValues) => {
    try {
      await deleteMyAccount(data.deletePassword);

      successAlert('탈퇴 완료', '회원 탈퇴가 완료되었습니다.')
          .then(() => {
            setOpenDeleteModal(false);
            logout();
            navigate('/');
          });
    } catch (error: any) {
      console.error('탈퇴 실패:', error);
      const serverMessage = error.response?.data?.message || '비밀번호가 틀렸거나 탈퇴에 실패했습니다.';
      errorAlert('탈퇴 실패', serverMessage);
    }
  };

  return (
      <div className='max-w-2xl mx-auto'>
        <Card className='shadow-none border border-gray-200'>
          <CardHeader floated={false} shadow={false} className='rounded-none'>
            <Typography variant='h5' color='blue-gray'>회원 정보 수정</Typography>
          </CardHeader>

          <CardBody className='flex flex-col gap-8'>
            {/* 닉네임 변경 */}
            <form onSubmit={handleSubmit(onNicknameUpdate)} className='flex flex-col gap-4'>
              <Typography variant='h6' color='blue-gray'>닉네임 변경</Typography>
              <div>
                <Typography variant='small' color='blue-gray' className='mb-2 font-medium'>새 닉네임</Typography>
                <div className='flex gap-2'>
                  <Input
                      size='lg'
                      error={!!errors.nickname}
                      crossOrigin={undefined}
                      {...register('nickname', {
                        required: '닉네임을 입력해주세요.',
                        pattern: {
                          value: VALIDATION_PATTERNS.nickname,
                          message: VALIDATION_MESSAGES.nickname,
                        },
                      })}
                  />
                  <Button
                      type='button'
                      variant='outlined'
                      size='sm'
                      color='blue'
                      className='shrink-0'
                      onClick={handleCheckNickname}
                      disabled={!nicknameValue || !!errors.nickname || nicknameValue === user?.nickname}
                  >
                    중복 확인
                  </Button>
                </div>
                {errors.nickname ? (
                    <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                      ⚠️ {errors.nickname.message}
                    </Typography>
                ) : (
                    isNicknameChecked && nicknameValue !== user?.nickname && (
                        <Typography variant='small' color='green' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                          ✅ 확인 완료
                        </Typography>
                    )
                )}
              </div>
              <div className='flex justify-end mt-2'>
                <Button variant='gradient' color='blue' type='submit'
                        disabled={!isNicknameChecked || nicknameValue === user?.nickname}>
                  닉네임 변경하기
                </Button>
              </div>
            </form>

            <hr className='border-gray-200'/>

            {/* 비밀번호 변경 */}
            <form onSubmit={handleSubmit(onPasswordUpdate)} className='flex flex-col gap-4'>
              <Typography variant='h6' color='blue-gray'>비밀번호 변경</Typography>

              <div>
                <Typography variant='small' color='blue-gray' className='mb-2 font-medium'>새 비밀번호</Typography>
                <Input
                    type='password'
                    size='lg'
                    placeholder='변경할 경우에만 입력하세요'
                    error={!!errors.password}
                    crossOrigin={undefined}
                    {...register('password', {
                      pattern: {
                        value: VALIDATION_PATTERNS.password,
                        message: VALIDATION_MESSAGES.password,
                      },
                    })}
                />
                {errors.password &&
                    <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                      ⚠️ {errors.password.message}
                    </Typography>
                }
              </div>

              <div>
                <Typography variant='small' color='blue-gray' className='mb-2 font-medium'>새 비밀번호 확인</Typography>
                <Input
                    type='password'
                    size='lg'
                    error={!!errors.confirmPassword}
                    crossOrigin={undefined}
                    {...register('confirmPassword', {
                      validate: (val) => {
                        if (passwordValue && val !== passwordValue) {
                          return VALIDATION_MESSAGES.confirmPassword;
                        }
                        return true;
                      }
                    })}
                />
                {errors.confirmPassword &&
                    <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                      ⚠️ {errors.confirmPassword.message}
                    </Typography>
                }
              </div>

              <div className='flex justify-end mt-2'>
                <Button variant='gradient' color='blue' type='submit'
                        disabled={!passwordValue || !!errors.password || !!errors.confirmPassword}>
                  비밀번호 변경하기
                </Button>
              </div>
            </form>

            <hr className='border-gray-200'/>

            {/* 이메일 인증 */}
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-2'>
                <Typography variant='h6' color='blue-gray'>이메일 인증</Typography>
                {user?.isVerified && (
                    <Typography variant='small' color='green' className='font-bold flex items-center gap-1'>
                      ✅ 인증 완료됨
                    </Typography>
                )}
              </div>

              <div>
                <Typography variant='small' color='blue-gray' className='mb-2 font-medium'>이메일 주소</Typography>
                <div className='flex gap-2'>
                  <Input
                      size='lg'
                      placeholder='example@email.com'
                      error={!!errors.email}
                      disabled={user?.isVerified || loading}
                      crossOrigin={undefined}
                      {...register('email', {
                        pattern: {
                          value: VALIDATION_PATTERNS.email,
                          message: VALIDATION_MESSAGES.email,
                        },
                      })}
                  />
                  {!user?.isVerified && (
                      <Button
                          type='button'
                          variant='outlined'
                          size='sm'
                          color='blue'
                          className='shrink-0'
                          onClick={handleSendCode}
                          disabled={!emailValue || !!errors.email || loading}
                      >
                        {isCodeSent ? '재발송' : '인증 요청'}
                      </Button>
                  )}
                </div>
                {errors.email &&
                    <Typography variant='small' color='red' className='mt-1 text-xs ml-1 flex items-center gap-1'>
                      ⚠️ {errors.email.message}
                    </Typography>
                }
              </div>

              {isCodeSent && !user?.isVerified && (
                  <div className='animate-fade-in'>
                    <Typography variant='small' color='blue-gray' className='mb-2 font-medium'>인증 코드 (6자리)</Typography>
                    <div className='flex gap-2'>
                      <Input
                          size='lg'
                          placeholder='000000'
                          disabled={loading}
                          crossOrigin={undefined}
                          {...register('verificationCode')}
                      />
                      <Button
                          variant='gradient'
                          color='blue'
                          size='sm'
                          className='shrink-0'
                          onClick={handleVerifyCode}
                          disabled={!verificationCodeValue || loading}
                      >
                        {loading ? '확인 중...' : '인증 확인'}
                      </Button>
                    </div>
                  </div>
              )}
            </div>

            <hr className='border-gray-200'/>

            {/* 회원 탈퇴 */}
            <div className='flex justify-start'>
              <Button variant='text' color='red' onClick={handleOpenDelete} className='px-2'>
                회원 탈퇴
              </Button>
            </div>
          </CardBody>
        </Card>

        <CommonModal
            open={openDeleteModal}
            handleOpen={handleOpenDelete}
            title='회원 탈퇴'
            size='xs'
            footer={
              <>
                <Button variant='text' color='blue-gray' onClick={handleOpenDelete} className='mr-1'>취소</Button>
                <Button variant='gradient' color='red' onClick={handleSubmit(onDeleteAccount)}>탈퇴하기</Button>
              </>
            }
        >
          <div className='flex flex-col gap-6 p-4 sm:p-6'>
            <Typography className='text-gray-600 font-normal leading-relaxed'>
              정말로 탈퇴하시겠습니까? <br/>
              본인 확인을 위해 비밀번호를 입력해주세요.
            </Typography>
            <Input
                label='비밀번호 입력'
                type='password'
                size='lg'
                crossOrigin={undefined}
                {...register('deletePassword')}
            />
          </div>
        </CommonModal>
      </div>
  );
};

export default MyProfileEdit;
