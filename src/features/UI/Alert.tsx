import cn from 'clsx';
import React from 'react';
import { BiCheck, BiError } from 'react-icons/bi';
import { IoWarning } from 'react-icons/io5';

type Props = {
  type: 'success' | 'error' | 'warning';
  message: string;
};

export const Alert = ({ type, message }: Props) => {
  const variantsMap = {
    success: 'bg-green-700/30',
    error: 'bg-red-700/30',
    warning: 'bg-yellow-700/40 text-yellow-500',
  };
  const icons = {
    success: <BiCheck className='text-green-500 h-6 w-6' />,
    error: <BiError className='text-red-500 h-6 w-6' />,
    warning: <IoWarning className='text-yellow-500 h-6 w-6' />,
  };
  return (
    <div className='mx-auto w-full grid lg:text-lg grid-cols-1 place-items-center gap-4 text-center'>
      <div
        className={cn(
          'rounded p-4 flex items-center gap-4 w-full',
          `${variantsMap[type]}`
        )}
      >
        {icons[type]}
        <p>{message}</p>
      </div>
    </div>
  );
};
