import {FC, ReactNode} from 'react';

import {Card, CardHeader, Typography, CardBody, CardFooter} from '@material-tailwind/react';
import {ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon} from '@heroicons/react/24/outline';

import {SortConfig} from '@/types/ui';

interface CommonTableProps {
  title: string;
  headers: string[];
  children: ReactNode;
  pagination?: ReactNode;
  onSort?: (key: string, direction: 'asc' | 'desc' | null) => void;
  currentSort?: SortConfig;
}

const CommonTable: FC<CommonTableProps> = ({title, headers, children, pagination, onSort, currentSort}) => {

  const handleHeaderClick = (head: string) => {
    if (!onSort) {
      return;
    }

    //클릭 시 default -> 오름차순 -> 내림차순 -> default 순
    let nextDirection: 'asc' | 'desc' | null = null;
    if (currentSort?.key === head) {
      if (currentSort.direction === 'asc') {
        nextDirection = 'desc';
      } else if (currentSort.direction === 'desc') {
        nextDirection = null;
      } else {
        nextDirection = 'asc';
      }
    } else {
      nextDirection = 'asc';
    }

    onSort(head, nextDirection);
  };

  const renderSortIcon = (head: string) => {
    if (!onSort) {
      return null;
    }
    if (currentSort?.key !== head || !currentSort.direction) {
      return <ChevronUpDownIcon className='h-4 w-4 opacity-50 ml-1'/>;
    }
    return currentSort.direction === 'asc' ?
        <ChevronUpIcon className='h-4 w-4 text-blue-500 ml-1 font-bold'/> :
        <ChevronDownIcon className='h-4 w-4 text-blue-500 ml-1 font-bold'/>;
  };

  return (
      <Card
          className='h-full w-full shadow-sm border border-gray-200'
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
      >
        <CardHeader
            floated={false}
            shadow={false}
            className='rounded-none'
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
        >
          <div className='flex items-center justify-between gap-8 mb-2'>
            <div>
              <Typography variant='h5' color='blue-gray'>
                {title}
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody
            className='overflow-scroll px-0 py-0'
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
        >
          <table className='mt-4 w-full min-w-max table-auto text-left'>
            <thead>
            <tr>
              {headers.map((head) => (
                  <th
                      key={head}
                      className={`border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 ${onSort ? 'cursor-pointer hover:bg-blue-gray-100/50 transition-colors' : ''}`}
                      onClick={() => handleHeaderClick(head)}
                  >
                    <div className='flex items-center'>
                      <Typography
                          variant='small'
                          className='text-font-main font-bold leading-none'
                      >
                        {head}
                      </Typography>
                      {renderSortIcon(head)}
                    </div>
                  </th>
              ))}
            </tr>
            </thead>

            <tbody>
            {children}
            </tbody>
          </table>
        </CardBody>

        {pagination && (
            <CardFooter
                className='flex items-center justify-center border-t border-blue-gray-50 p-4'
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
            >
              {pagination}
            </CardFooter>
        )}
      </Card>
  );
};

export default CommonTable;
