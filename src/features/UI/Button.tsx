import cn from 'clsx';
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from 'react';

import { Spinner } from './Spinner';

const sizeClassnames = {
  big: 'py-2 px-6 text-sm',
  small: 'px-2 py-1 text-sm lg:px-3 lg:py-2 text-base',
  tiny: 'px-1 text-sm',
  noPadding: 'p-0',
};

const roundedClassnames = {
  none: 'rounded-none',
  large: 'rounded-lg',
  medium: 'rounded',
  small: 'rounded-sm',
  full: 'rounded-full',
};

// TODO extract more buttons
const variantClassnames = {
  primary: 'bg-brand-blue',
  danger: 'bg-red-500/80 text-red-500',
  link: 'text-base sm:text-lg border-b-3 hover:border-b-3 hover:text-white',
  underline:
    'border-b border-[#4799eb] rounded-none hover:bg-[#4799eb] hover:rounded',
  transparent: 'bg-transparent',
  outline: 'border-2 border-gray-100/5 p-2.5 hover:text-[#4799eb]',
  gradient:
    'bg-gradient-to-r from-[#e052a0] to-[#f15c41] rounded-sm hover:from-cyan-500 hover:to-blue-500 disabled:bg-red-500',
  'gradient-inverse':
    'disabled:hover:bg-gray-400 bg-gradient-to-r hover:from-[#e052a0] hover:to-[#f15c41] rounded-sm from-cyan-500 to-blue-500 disabled:bg-opacity-50',
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
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isActive?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
      iconPosition = 'left',
      fullWidth = false,
      isActive = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          `flex outline-none text-base text-gray-100 disabled:cursor-not-allowed items-center justify-center focus:ring-0 group ${sizeClassnames[size]} ${variantClassnames[variant]} ${roundedClassnames[rounded]}`,
          className && ` ${className}`,
          {
            'transition-colors ease-linear': transition,
            'w-full': fullWidth,
            'border-[#4799eb] border-b-3 text-white':
              isActive && variant === 'link',
            'border-transparent hover:border-[#385c80] text-[#b6cce2]':
              !isActive && variant === 'link',
          }
        )}
        data-testid='button'
        {...props}
      >
        {loading ? (
          <span className='flex items-center gap-4'>
            <Spinner size={size === 'small' ? '2' : '4'} />
            <span>{loadingText}</span>
          </span>
        ) : (
          <span
            className={cn('flex items-center', {
              'opacity-0': loading,
              'flex-row-reverse': iconPosition === 'right',
            })}
          >
            {icon ? (
              <span
                className={cn('items-center', {
                  'mr-4': iconPosition === 'left',
                  'ml-4': iconPosition === 'right',
                })}
              >
                {icon}
              </span>
            ) : null}
            {children}
          </span>
        )}
      </button>
    );
  }
);
