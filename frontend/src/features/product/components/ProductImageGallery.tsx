import {getFullImageUrl} from '@/utils/imageUtils';

import defaultImage from '@/assets/images/general/grass_block.jpeg';

interface ProductImageGalleryProps {
  imageUrl?: string | null;
  title?: string;
}

const ProductImageGallery = ({imageUrl, title}: ProductImageGalleryProps) => {
  return (
      <div className='md:col-span-1'>
        <img
            src={getFullImageUrl(imageUrl) || defaultImage}
            alt={title || '상품 이미지'}
            className='w-full h-64 md:h-full object-cover rounded-lg border border-gray-200 shadow-sm'
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
        />
      </div>
  );
};

export default ProductImageGallery;
