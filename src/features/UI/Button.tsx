import cn from 'clsx';
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from 'react';

import { Spinner } from './Spinner';

const sizeClassnames = {
  big: 'py-2 px-6 text-sm',
  small: 'px-2 py-1 text-sm',
  tiny: 'px-1 text-sm',
};

const roundedClassnames = {
  large: 'rounded-lg',
  medium: 'rounded',
  small: 'rounded-sm',
  full: 'rounded-full',
};

// TODO extract more buttons
const variantClassnames = {
  primary: '',
  secondary: '',
  transparent: 'bg-transparent',
  outline: 'border-2 border-gray-100/5 p-2.5 hover:text-[#4799eb]',
  gradient:
    'bg-gradient-to-r from-[#e052a0] to-[#f15c41] rounded-sm hover:from-cyan-500 hover:to-blue-500',
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  variant?: keyof typeof variantClassnames;
  rounded?: keyof typeof roundedClassnames;
  loading?: boolean;
  icon?: ReactNode;
  transition?: boolean;
  type?: 'button' | 'submit';
  loadingText?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'big',
  variant = 'primary',
  disabled,
  loading,
  icon,
  rounded = 'medium',
  className = '',
  transition,
  type = 'button',
  loadingText = 'loading',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        `flex outline-none text-base text-gray-100 disabled:cursor-not-allowed items-center justify-center focus:ring-0 group ${sizeClassnames[size]} ${variantClassnames[variant]} ${roundedClassnames[rounded]}`,
        className && ` ${className}`,
        {
          'transition-colors ease-linear': transition,
        }
      )}
      data-testid='button'
      {...props}
    >
      {loading ? (
        <span className='flex gap-4 items-center'>
          <Spinner size={size === 'small' ? '2' : '4'} />
          <span>{loadingText}</span>
        </span>
      ) : (
        <span className={loading ? 'opacity-0' : `flex items-center`}>
          {icon ? <span className='mr-4 items-center'>{icon}</span> : null}
          {children}
        </span>
      )}
    </button>
  );
};
