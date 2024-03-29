import cn from 'clsx';
import React from 'react';
import { BiCheck, BiError } from 'react-icons/bi';
import { IoWarning } from 'react-icons/io5';

type Props = {
  type: 'success' | 'error' | 'warning';
  message: React.ReactNode;
  className?: string;
};

export const Alert = ({ type, message, className }: Props) => {
  const variantsMap = {
    success: 'bg-green-700/30',
    error: 'bg-red-700/20 text-red-500',
    warning: 'bg-yellow-700/30 text-yellow-500',
  };
  const icons = {
    success: <BiCheck className='h-6 w-6 text-green-500' />,
    error: <BiError className='h-6 w-6 text-red-500' />,
    warning: <IoWarning className='h-6 w-6 text-yellow-500' />,
  };
  return (
    <div
      className={`mx-auto w-full gap-4 text-center lg:text-lg ${
        className ? className : ''
      }`}
    >
      <div
        className={cn(
          'rounded p-4 flex items-center gap-4 w-full',
          `${variantsMap[type]}`
        )}
      >
        {icons[type]}
        <div>{message}</div>
      </div>
    </div>
  );
};
