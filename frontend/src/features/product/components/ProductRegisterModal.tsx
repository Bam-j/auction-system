import {useState, ChangeEvent, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm, FormProvider} from 'react-hook-form';

import {Button, Typography, Textarea} from '@material-tailwind/react';
import {PhotoIcon} from '@heroicons/react/24/outline';

//절대 경로 모듈
import CommonModal from '@/components/ui/CommonModal';
import {getMe} from '@/features/auth/api/authApi';
import {successAlert, errorAlert, warningAlert} from '@/utils/swalUtils';
import {compressAndConvertImage} from '@/utils/imageUtils';
import useAuthStore from '@/stores/useAuthStore';

//도메인 내부 api, 자식 컴포넌트
import {registerProduct, ProductRegisterData} from '../api/productApi';
import CommonProductForm from './forms/CommonProductForm';
import FixedProductForm from './forms/FixedProductForm';
import AuctionProductForm from './forms/AuctionProductForm';

const ProductRegisterModal = () => {
  const navigate = useNavigate();
  const {user, setUser} = useAuthStore();
  const [step, setStep] = useState(1);

  const methods = useForm<ProductRegisterData>({
    defaultValues: {
      type: 'FIXED',
      product_name: '',
      description: '',
      category: '',
      image: null,
      price: 0,
      stock: 0,
      ended_at: '',
      start_price: 0,
      min_bid_increment: 0,
      instant_purchase_price: 0,
      price_unit: 'EMERALD',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = methods;

  const productType = watch('type');
  const image = watch('image');

  //컴포넌트 마운트 시 최신 유저 정보 확인
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error);
      }
    };
    fetchUser();
  }, [setUser]);

  const handleClose = () => navigate(-1);

  const checkVerification = () => {
    if (!user) {
      warningAlert('로그인을 해주세요').then(() => navigate('/login'));
      return false;
    }

    const isVerified = user.isVerified || (user as any).verified;

    if (!isVerified) {
      warningAlert('인증이 필요합니다.', '이메일 인증을 완료한 계정만 상품을 등록할 수 있습니다.').then(
          () => navigate(-1)
      );
      return false;
    }
    return true;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
    }
  };

  const onSubmit = async (data: ProductRegisterData) => {
    try {
      //이미지 최적화
      let finalData = {...data};
      if (data.image) {
        try {
          const optimized = await compressAndConvertImage(data.image);
          finalData.image = optimized;
        } catch (imgError) {
          console.error('이미지 최적화 실패:', imgError);
        }
      }

      await registerProduct(finalData);

      successAlert('상품 등록 완료!', '상품이 성공적으로 등록되었습니다.').then(() => {
        navigate('/');
      });
    } catch (error: any) {
      console.error('등록 실패 상세:', error.response?.data);

      const serverMessage = error.response?.data?.message || '상품 등록 중 오류가 발생했습니다.';
      const validationErrors = error.response?.data?.validationErrors;

      let errorText = serverMessage;
      if (validationErrors) {
        errorText = Object.values(validationErrors).join('\n');
      }

      errorAlert('등록 실패', errorText);
    }
  };

  if (step === 1) {
    return (
        <CommonModal open={true} handleOpen={handleClose} title='상품 등록 유형 선택' size='sm'>
          <div className='flex flex-col gap-4 py-4 px-6'>
            <Button
                className='h-24 text-lg normal-case bg-primary hover:bg-primary-dark text-white'
                onClick={() => {
                  if (!checkVerification()) return;
                  setValue('type', 'FIXED');
                  setStep(2);
                }}
            >
              <div className='flex flex-col items-center'>
                <span>일반 판매 등록</span>
                <Typography variant='small' className='mt-1 opacity-70 font-normal text-font-white'>
                  정해진 가격에 즉시 판매합니다.
                </Typography>
              </div>
            </Button>

            <Button
                className='h-24 text-lg normal-case bg-warning hover:bg-warning-dark text-white'
                onClick={() => {
                  if (!checkVerification()) return;
                  setValue('type', 'AUCTION');
                  setStep(2);
                }}
            >
              <div className='flex flex-col items-center'>
                <span>경매 물품 등록</span>
                <Typography variant='small' className='mt-1 opacity-70 font-normal text-font-white'>
                  입찰을 통해 가장 높은 가격에 판매합니다.
                </Typography>
              </div>
            </Button>
          </div>
        </CommonModal>
    );
  }

  return (
      <CommonModal
          open={true}
          handleOpen={handleClose}
          title={productType === 'FIXED' ? '일반 판매 상품 정보 입력' : '경매 물품 정보 입력'}
          size='lg'
          footer={
            <div className='flex w-full items-center justify-between'>
              <Button variant='text' color='red' onClick={() => setStep(1)}>
                이전 단계
              </Button>
              <div className='flex gap-2'>
                <Button variant='text' color='blue-gray' onClick={handleClose}>
                  취소
                </Button>
                <Button variant='gradient' color='green' onClick={handleSubmit(onSubmit)}>
                  등록하기
                </Button>
              </div>
            </div>
          }
      >
        <FormProvider {...methods}>
          <div className='flex flex-col gap-6 p-4 max-h-[65vh] overflow-y-auto pr-4'>
            <div className='flex flex-col gap-3'>
              <Typography variant='h6' color='blue-gray' className='flex items-center gap-2'>
                <PhotoIcon className='h-5 w-5'/> 상품 대표 이미지
              </Typography>
              <div className='flex items-center gap-4 border border-blue-gray-200 rounded-lg p-3 bg-gray-50/50'>
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className={`
                      w-full
                      text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                      file:bg-primary file:text-white hover:file:bg-primary-dark
                      cursor-pointer
                    `}
                />
              </div>
              {image && (
                  <Typography variant='small' color='green' className='ml-1'>
                    선택된 파일: {image.name}
                  </Typography>
              )}
            </div>

            <hr className='border-gray-200'/>

            <CommonProductForm />

            {productType === 'FIXED' ? (
                <FixedProductForm />
            ) : (
                <AuctionProductForm />
            )}

            <hr className='border-gray-200'/>

            <div className='flex flex-col gap-3'>
              <Typography variant='h6' color='blue-gray'>
                상품 상세 설명
              </Typography>
              <div>
                <Textarea
                    label='상품의 상태, 옵션 등을 자세히 적어주세요.'
                    size='lg'
                    className='min-h-[120px]'
                    error={!!errors.description}
                    {...register('description', {required: '상세 설명을 입력해주세요.'})}
                />
                {errors.description && (
                    <p className='mt-1 text-xs text-red-500 ml-1'>⚠️ {errors.description.message}</p>
                )}
              </div>
            </div>
          </div>
        </FormProvider>
      </CommonModal>
  );
};

export default ProductRegisterModal;
