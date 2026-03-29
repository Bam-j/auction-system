import {FC} from 'react';

import {Button, IconButton, Tooltip} from '@material-tailwind/react';
import {EyeIcon} from '@heroicons/react/24/outline';

interface TableActionButtonsProps {
  onView?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  isBlocked?: boolean;
  disabled?: boolean;
}

const TableActionButtons: FC<TableActionButtonsProps> = ({
                                                           onView,
                                                           onDelete,
                                                           deleteLabel = '삭제',
                                                           isBlocked = false,
                                                           disabled = false
                                                         }) => {
  return (
      <div className='flex items-center gap-2'>
        {onDelete && (
            <Button
                size='sm'
                color={isBlocked ? 'blue' : 'red'}
                variant={isBlocked ? 'outlined' : 'gradient'}
                className='whitespace-nowrap px-3'
                onClick={onDelete}
                disabled={disabled}
            >
              {isBlocked ? '차단 해제' : deleteLabel}
            </Button>
        )}

        {onView && (
            <Tooltip content='상세 정보 확인'>
              <IconButton size='sm' variant='text' color='blue-gray' onClick={onView}>
                <EyeIcon className='h-4 w-4'/>
              </IconButton>
            </Tooltip>
        )}
      </div>
  );
};

export default TableActionButtons;
