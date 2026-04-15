import {FC, ReactNode} from 'react';

import {Dialog, DialogHeader, DialogBody, DialogFooter, Typography} from '@material-tailwind/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {size} from '@material-tailwind/react/types/components/dialog';

interface CommonModalProps {
  open: boolean;
  handleOpen: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: size;
  bodyClassName?: string;
}

const CommonModal: FC<CommonModalProps> = ({
                                             open,
                                             handleOpen,
                                             title,
                                             children,
                                             footer,
                                             size = 'md',
                                             bodyClassName = ''
                                           }) => {
  return (
      <Dialog open={open} handler={handleOpen} size={size} className='overflow-hidden bg-surface dark:bg-surface'>
        <DialogHeader className='justify-between border-b border-border'>
          <Typography variant='h5' className='text-font-main'>
            {title}
          </Typography>
          <XMarkIcon
              className='h-5 w-5 cursor-pointer text-font-sub hover:text-font-main'
              onClick={handleOpen}
          />
        </DialogHeader>

        <DialogBody className={`p-0 text-font-main ${bodyClassName}`}>
          {children}
        </DialogBody>

        {footer && (
            <DialogFooter className='border-t border-border bg-background/50'>
              {footer}
            </DialogFooter>
        )}
      </Dialog>
  );
};

export default CommonModal;
