import {FC} from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'gray';
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({size = 'medium', color = 'blue'}) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-8',
  };

  const colorClasses = {
    blue: 'border-border border-t-primary',
    gray: 'border-border border-t-font-muted',
  };

  return (
      <div className='flex justify-center items-center p-8'>
        <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
      </div>
  );
};

export default LoadingSpinner;
