import {Typography} from '@material-tailwind/react';

interface ProductDescriptionProps {
  description?: string;
}

const ProductDescription = ({description}: ProductDescriptionProps) => {
  return (
    <div>
      <Typography variant='h6' color='blue-gray' className='mb-3'>
        상품 부가 설명
      </Typography>
      <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[120px]'>
        <Typography className='text-gray-700 whitespace-pre-line font-normal'>
          {description || '등록된 설명이 없습니다.'}
        </Typography>
      </div>
    </div>
  );
};

export default ProductDescription;
