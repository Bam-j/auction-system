import {ChangeEvent} from 'react';

import {Input} from '@material-tailwind/react';

import {ProductRegisterData} from '../../api/productApi';

interface FixedProductFormProps {
  formData: ProductRegisterData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FixedProductForm = ({formData, handleChange}: FixedProductFormProps) => {
  return (
      <div className='grid grid-cols-2 gap-6'>
        <Input
            type='text'
            label='판매 가격 (에메랄드/블록/주화)'
            name='price'
            value={formData.price || ''}
            onChange={handleChange}
            crossOrigin=''
        />
        <Input
            type='number'
            label='재고 수량 (개)'
            name='stock'
            value={formData.stock || ''}
            onChange={handleChange}
            min='1'
            crossOrigin=''
        />
      </div>

  );
};

export default FixedProductForm;
