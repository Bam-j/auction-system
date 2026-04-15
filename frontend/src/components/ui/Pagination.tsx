import {FC} from 'react';

import {IconButton} from '@material-tailwind/react';
import {ArrowRightIcon, ArrowLeftIcon} from '@heroicons/react/24/outline';
import {variant, color} from '@material-tailwind/react/types/components/button';

interface PaginationProps {
  active: number;
  total: number;
  onChange: (index: number) => void;
}

const Pagination: FC<PaginationProps> = ({active, total, onChange}) => {
  const next = () => {
    if (active === total) {
      return;
    }
    onChange(active + 1);
  };

  const prev = () => {
    if (active === 1) {
      return;
    }
    onChange(active - 1);
  };

  const getItemProps = (index: number) => ({
    variant: (active === index ? 'filled' : 'text') as variant,
    color: (active === index ? 'blue' : 'blue-gray') as color,
    onClick: () => onChange(index),
    className: `rounded-full transition-colors font-bold ${active === index ? '' : 'dark:text-font-main dark:hover:bg-primary/10'}`,
  });

  const renderPageNumbers = () => {
    if (total <= 5) {
      return Array.from({length: total}, (_, i) => i + 1).map((idx) => (
          <IconButton key={idx} {...getItemProps(idx)} size='sm'>
            {idx}
          </IconButton>
      ));
    }

    let pages: number[] = [];

    if (active <= 3) {
      pages = [1, 2, 3, 4, 5];
      return (
          <>
            {pages.map((idx) => (
                <IconButton key={idx} {...getItemProps(idx)} size='sm'>{idx}</IconButton>
            ))}
            <span className='text-font-sub'>...</span>
            <IconButton {...getItemProps(total)} size='sm'>{total}</IconButton>
          </>
      );
    } else if (active >= total - 2) {
      pages = [total - 4, total - 3, total - 2, total - 1, total];
      return (
          <>
            <IconButton {...getItemProps(1)} size='sm'>1</IconButton>
            <span className='text-font-sub'>...</span>
            {pages.map((idx) => (
                <IconButton key={idx} {...getItemProps(idx)} size='sm'>{idx}</IconButton>
            ))}
          </>
      );
    } else {
      return (
          <>
            <IconButton {...getItemProps(1)} size='sm'>1</IconButton>
            <span className='text-font-sub'>...</span>

            <IconButton {...getItemProps(active - 1)} size='sm'>{active - 1}</IconButton>
            <IconButton {...getItemProps(active)} size='sm'>{active}</IconButton>
            <IconButton {...getItemProps(active + 1)} size='sm'>{active + 1}</IconButton>

            <span className='text-font-sub'>...</span>
            <IconButton {...getItemProps(total)} size='sm'>{total}</IconButton>
          </>
      );
    }
  };

  return (
      <div className='flex items-center gap-2'>
        <IconButton
            variant='text'
            className='rounded-full dark:text-font-main dark:hover:bg-primary/10'
            onClick={prev}
            disabled={active === 1}
            size='sm'
        >
          <ArrowLeftIcon strokeWidth={2} className='h-4 w-4'/>
        </IconButton>

        <div className='flex items-center gap-1'>
          {renderPageNumbers()}
        </div>

        <IconButton
            variant='text'
            className='rounded-full dark:text-font-main dark:hover:bg-primary/10'
            onClick={next}
            disabled={active === total}
            size='sm'
        >
          <ArrowRightIcon strokeWidth={2} className='h-4 w-4'/>
        </IconButton>
      </div>
  );
};

export default Pagination;
