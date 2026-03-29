import {FC} from 'react';

import {Chip} from '@material-tailwind/react';
import {color} from '@material-tailwind/react/types/components/chip';

interface StatusConfig {
  color: color;
  label: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  //상품 상태
  FIXED_SALES: {color: 'green', label: '판매중'},
  SELLING: {color: 'green', label: '판매중'},
  SOLD_OUT: {color: 'blue-gray', label: '판매완료'},
  INSTANT_BUY: {color: 'deep-orange', label: '즉시구매완료'},
  AUCTION: {color: 'blue', label: '경매중'},
  CLOSED: {color: 'blue-gray', label: '경매 마감'},

  //입찰 상태
  BIDDING: {color: 'blue', label: '입찰 중'},
  SUCCESS: {color: 'green', label: '낙찰'},
  FAILED: {color: 'red', label: '패찰'},

  //즉시 구매 요청 상태
  PENDING: {color: 'amber', label: '대기중'},
  APPROVED: {color: 'green', label: '승인됨'},
  REJECTED: {color: 'red', label: '거절됨'},

  //사용자 상태
  ACTIVE: {color: 'green', label: '정상'},
  DELETED: {color: 'blue-gray', label: '탈퇴함'},
  BLOCKED: {color: 'red', label: '차단됨'},

  //사용자 권한
  USER: {color: 'blue', label: '일반 사용자'},
  ADMIN: {color: 'purple', label: '관리자'}
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: FC<StatusBadgeProps> = ({status}) => {
  const config = STATUS_CONFIG[status] || {color: 'gray' as color, label: status};

  return (
      <Chip
          size='sm'
          variant='gradient'
          value={config.label}
          color={config.color}
          className='w-max rounded-full px-3 py-1 font-bold shadow-md'
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
      />
  );
};

export default StatusBadge;
