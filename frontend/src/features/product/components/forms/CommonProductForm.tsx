import {useFormContext, Controller} from 'react-hook-form';

import {Input, Select, Option} from '@material-tailwind/react';

import {translateCategory} from '@/utils/categoryTranslations';

import {ProductRegisterData} from '../../api/productApi';

const CATEGORIES = [
  'WEAPON',
  'ARMOR',
  'TOOL',
  'COSMETIC',
  'TITLE',
  'BLOCK',
  'REDSTONE_DEVICES',
  'ORE',
  'GROWTH_GOODS',
  'ETC',
];

const CommonProductForm = () => {
  const {
    register,
    control,
    formState: {errors},
  } = useFormContext<ProductRegisterData>();

  return (
      <div className='grid grid-cols-1 gap-6'>
        <div>
          <Input
              label='상품명'
              size='lg'
              className='!text-lg'
              error={!!errors.product_name}
              crossOrigin=''
              {...register('product_name', {required: '상품명을 입력해주세요.'})}
          />
          {errors.product_name && (
              <p className='mt-1 text-xs text-red-500 ml-1'>⚠️ {errors.product_name.message}</p>
          )}
        </div>
        <div>
          <Controller
              name='category'
              control={control}
              rules={{required: '카테고리를 선택해주세요.'}}
              render={({field}) => (
                  <Select
                      label='카테고리 분류'
                      size='lg'
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      error={!!errors.category}
                  >
                    {CATEGORIES.map((cat) => (
                        <Option key={cat} value={cat}>
                          {translateCategory(cat)}
                        </Option>
                    ))}
                  </Select>
              )}
          />
          {errors.category && (
              <p className='mt-1 text-xs text-red-500 ml-1'>⚠️ {errors.category.message}</p>
          )}
        </div>
      </div>
  );
};

export default CommonProductForm;
