import React, { forwardRef } from 'react';

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  textarea?: boolean;
  rows?: number;
  error?: string;
  transparent?: boolean;
  label?: string;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ className, textarea, error, transparent, label, ...props }, ref) => {
  const bg = transparent ? `bg-transparent` : `bg-[#1E364D]`;
  const ring = error ? `ring-1 ring-red-400` : '';
  const cn = `w-full p-2 rounded text-gray-300 placeholder:text-gray-500 placeholder-red-300  outline-none appearance-none focus:outline-none  ${bg} ${ring} ${className} `;

  return textarea ? (
    <textarea ref={ref} className={cn} {...(props as any)} />
  ) : (
    <div>
      <label
        htmlFor={label}
        className='my-2 inline-block text-lg capitalize text-white'
      >
        {label}
      </label>
      <input ref={ref} className={cn} {...(props as any)} />
    </div>
  );
});

Input.displayName = 'Input';
