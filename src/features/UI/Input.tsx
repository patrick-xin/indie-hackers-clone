import React, { forwardRef } from 'react';

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  textarea?: boolean;
  rows?: number;
  error?: string;
  transparent?: boolean;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ className, textarea, error, transparent, ...props }, ref) => {
  const bg = transparent ? `bg-transparent` : `bg-[#152C41]`;
  const ring = error ? `ring-1 ring-red-400` : '';
  const cn = `w-full p-2 rounded-8 text-gray-300 placeholder:text-gray-500 placeholder-red-300  outline-none appearance-none focus:outline-none focus:border-none ${bg} ${ring} ${className} `;

  return textarea ? (
    <textarea ref={ref} className={cn} {...(props as any)} />
  ) : (
    <input ref={ref} className={cn} {...(props as any)} />
  );
});

Input.displayName = 'Input';
