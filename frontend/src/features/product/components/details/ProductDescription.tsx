import {Typography} from '@material-tailwind/react';

interface ProductDescriptionProps {
  description?: string;
}

const ProductDescription = ({description}: ProductDescriptionProps) => {
  return (
    <div>
      <Typography variant='h6' className='mb-3 text-font-main'>
        상품 부가 설명
      </Typography>
      <div className='bg-background p-4 rounded-lg border border-border min-h-[120px] transition-colors duration-300'>
        <Typography className='text-font-main whitespace-pre-line font-normal'>
          {description || '등록된 설명이 없습니다.'}
        </Typography>
      </div>
    </div>
  );
};

export default ProductDescription;
