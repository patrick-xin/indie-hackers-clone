import React, { forwardRef } from 'react';

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  textarea?: boolean;
  rows?: number;
  error?: string;
  transparent?: boolean;
  label?: string;
  description?: string;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    { className, textarea, error, transparent, description, label, ...props },
    ref
  ) => {
    const bg = transparent ? `bg-transparent` : `bg-[#1E364D]`;
    const ring = error ? `ring-1 ring-red-400` : '';
    const cn = `w-full p-2 rounded text-gray-300 placeholder:text-gray-500 outline-none appearance-none focus:outline-none  ${bg} ${ring} ${className} disabled:bg-[#172C43] disabled:text-[#63809c]`;

    return textarea ? (
      <div>
        <label
          htmlFor={label}
          className='my-2 inline-block text-lg capitalize text-white'
        >
          {label}
        </label>
        {description && <p className='mt-1 mb-2'>{description}</p>}
        <textarea ref={ref} className={cn} {...(props as any)} />
      </div>
    ) : (
      <div>
        <label
          htmlFor={label}
          className='my-2 inline-block text-lg capitalize text-white'
        >
          {label}
        </label>
        {description && <p className='mt-1 mb-2'>{description}</p>}
        <input ref={ref} className={cn} {...(props as any)} />
      </div>
    );
  }
);

Input.displayName = 'Input';
