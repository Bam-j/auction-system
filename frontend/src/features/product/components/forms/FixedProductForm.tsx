import {useFormContext} from 'react-hook-form';

import {Input} from '@material-tailwind/react';

import {ProductRegisterData} from '../../api/productApi';

const FixedProductForm = () => {
  const {
    register,
    formState: {errors},
  } = useFormContext<ProductRegisterData>();

  return (
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Input
              type='number'
              label='판매 가격 (에메랄드/블록/주화)'
              error={!!errors.price}
              crossOrigin=''
              className='dark:text-font-main'
              labelProps={{
                className: 'dark:text-font-sub',
              }}
              {...register('price', {
                required: '가격을 입력해주세요.',
                min: {value: 0, message: '가격은 0 이상이어야 합니다.'},
              })}
          />
          {errors.price && (
              <p className='mt-1 text-xs text-danger ml-1'>⚠️ {errors.price.message}</p>
          )}
        </div>
        <div>
          <Input
              type='number'
              label='재고 수량 (개)'
              min='1'
              error={!!errors.stock}
              crossOrigin=''
              className='dark:text-font-main'
              labelProps={{
                className: 'dark:text-font-sub',
              }}
              {...register('stock', {
                required: '재고를 입력해주세요.',
                min: {value: 1, message: '재고는 1개 이상이어야 합니다.'},
              })}
          />
          {errors.stock && (
              <p className='mt-1 text-xs text-danger ml-1'>⚠️ {errors.stock.message}</p>
          )}
        </div>
      </div>
  );
};

export default FixedProductForm;
