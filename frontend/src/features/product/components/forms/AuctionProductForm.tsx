import {useFormContext} from 'react-hook-form';

import {Input, Radio, Typography} from '@material-tailwind/react';

import {ProductRegisterData} from '../../api/productApi';

const PRICE_UNITS = [
  {value: 'EMERALD', label: '에메랄드'},
  {value: 'EMERALD_BLOCK', label: '에메랄드 블록'},
  {value: 'EMERALD_COIN', label: '에메랄드 주화'},
];

const AuctionProductForm = () => {
  const {
    register,
    formState: {errors},
  } = useFormContext<ProductRegisterData>();

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  return (
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Input
                type='datetime-local'
                label='경매 마감일'
                min={minDateTime}
                error={!!errors.ended_at}
                containerProps={{className: 'min-w-[72px]'}}
                crossOrigin=''
                className='dark:text-font-main'
                labelProps={{
                  className: 'dark:text-font-sub',
                }}
                {...register('ended_at', {
                  required: '경매 마감일을 입력해주세요.',
                  validate: (value) => {
                    const selected = new Date(value || '');
                    return selected > new Date() || '현재 시간 이후여야 합니다.';
                  },
                })}
            />
            {errors.ended_at && (
                <p className='mt-1 text-xs text-danger ml-1'>⚠️ {errors.ended_at.message}</p>
            )}
          </div>
          <div>
            <Input
                type='number'
                label='경매 시작가'
                min='0'
                error={!!errors.start_price}
                crossOrigin=''
                className='dark:text-font-main'
                labelProps={{
                  className: 'dark:text-font-sub',
                }}
                {...register('start_price', {
                  required: '시작가를 입력해주세요.',
                  min: {value: 0, message: '0 이상이어야 합니다.'},
                })}
            />
            {errors.start_price && (
                <p className='mt-1 text-xs text-danger ml-1'>⚠️ {errors.start_price.message}</p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Input
                type='number'
                label='최소 입찰 단위'
                min='1'
                error={!!errors.min_bid_increment}
                crossOrigin=''
                className='dark:text-font-main'
                labelProps={{
                  className: 'dark:text-font-sub',
                }}
                {...register('min_bid_increment', {
                  required: '최소 입찰 단위를 입력해주세요.',
                  min: {value: 1, message: '1 이상이어야 합니다.'},
                })}
            />
            {errors.min_bid_increment && (
                <p className='mt-1 text-xs text-danger ml-1'>⚠️ {errors.min_bid_increment.message}</p>
            )}
          </div>
          <div>
            <Input
                type='number'
                label='즉시 구매가 (선택)'
                min='0'
                error={!!errors.instant_purchase_price}
                crossOrigin=''
                className='dark:text-font-main'
                labelProps={{
                  className: 'dark:text-font-sub',
                }}
                {...register('instant_purchase_price', {
                  min: {value: 0, message: '0 이상이어야 합니다.'},
                })}
            />
            {errors.instant_purchase_price && (
                <p className='mt-1 text-xs text-danger ml-1'>⚠️ {errors.instant_purchase_price.message}</p>
            )}
          </div>
        </div>

        <div className='border border-border rounded-lg p-4 bg-background/30'>
          <Typography variant='small' className='mb-2 font-bold text-font-main'>
            경매/입찰 화폐 단위
          </Typography>
          <div className='flex flex-wrap gap-4'>
            {PRICE_UNITS.map((unit) => (
                <Radio
                    key={unit.value}
                    label={unit.label}
                    value={unit.value}
                    color='blue'
                    crossOrigin=''
                    className='dark:border-border'
                    labelProps={{
                      className: 'dark:text-font-main'
                    }}
                    {...register('price_unit')}
                />
            ))}
          </div>
        </div>
      </div>
  );
};

export default AuctionProductForm;
