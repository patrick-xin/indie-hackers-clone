import cn from 'clsx';
import React, { ReactNode } from 'react';

import UnstyledLink, { UnstyledLinkProps } from './UnstyledLink';

enum ButtonVariant {
  'primary',
  'outline',
  'ghost',
  'underline',
  'blue',
}

type ButtonLinkProps = {
  isActive?: boolean;
  variant?: keyof typeof ButtonVariant;
  icon?: ReactNode;
} & UnstyledLinkProps;

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      isActive = false,
      icon,
      ...rest
    },
    ref
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          'inline-flex items-center rounded-sm group transition-colors ease-linear disabled:cursor-not-allowed focus:outline-none focus-visible:ring focus-visible:ring-red-500',
          variant === 'underline' && [
            'text-base sm:text-lg border-b-3 hover:border-b-3 hover:text-white py-2 h-12',
            {
              'border-[#4799eb] border-b-3 text-white': isActive,
              'border-transparent hover:border-[#385c80]': !isActive,
            },
          ],
          variant === 'ghost' && ['hover:text-brand-blue text-white'],
          [
            variant === 'primary' && [
              'bg-red-500 text-white',
              'border border-primary-600',
              'hover:bg-primary-600 hover:text-white',
              'active:bg-primary-500',
              'disabled:bg-primary-400 disabled:hover:bg-primary-400',
            ],
            variant === 'outline' && [
              'border-[1px] px-2 py-1 rounded-md hover:text-gray-200 border-indigo-400/30',

              isActive &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],

            variant === 'blue' && [
              ' text-white px-4 py-2',
              {
                'bg-brand-blue': isActive,
                'bg-[#1E364D]': !isActive,
              },
            ],
          ],
          className
        )}
      >
        {children}
        {icon ? <span>{icon}</span> : null}
      </UnstyledLink>
    );
  }
);
