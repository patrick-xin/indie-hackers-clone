import cn from 'clsx';
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from 'react';

import { Spinner } from './Spinner';

const sizeClassnames = {
  big: 'p-2 text-sm',
  medium: 'p-1 text-base',
  small: 'p-0.5 text-sm',
};

const roundedClassnames = {
  large: 'rounded-lg',
  medium: 'rounded',
  small: 'rounded-sm',
  full: 'rounded-full',
};

// TODO extract more buttons
const variantClassnames = {
  transparent: 'bg-transparent',
  outline: 'border-2 border-gray-100/5 hover:text-[#4799eb]',
  gradient:
    'bg-gradient-to-r from-[#e052a0] to-[#f15c41] rounded-sm hover:from-cyan-500 hover:to-blue-500 disabled:bg-red-500',
};

export type IconButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  variant?: keyof typeof variantClassnames;
  rounded?: keyof typeof roundedClassnames;
  loading?: boolean;
  icon?: ReactNode;
};

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'small',
  variant = 'transparent',
  disabled,
  loading,
  icon,
  rounded = 'medium',
  className = '',
  ...props
}) => {
  return (
    <button
      type='button'
      disabled={disabled || loading}
      className={cn(
        `flex outline-none text-gray-100 disabled:cursor-not-allowed disabled:bg-gray-900/10 items-center justify-center focus:ring-0 group transition-colors ease-linear ${sizeClassnames[size]} ${variantClassnames[variant]} ${roundedClassnames[rounded]}`,
        className && ` ${className}`
      )}
      data-testid='button'
      {...props}
    >
      {loading ? (
        <span>
          <Spinner size={size === 'small' ? '2' : '4'} />
        </span>
      ) : (
        <span className={loading ? 'opacity-0' : `flex items-center`}>
          {icon}
        </span>
      )}
    </button>
  );
};
