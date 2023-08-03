import React, { forwardRef } from 'react';

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  error?: string;
  transparent?: boolean;
  label?: string;
  description?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, transparent, description, label, ...props }, ref) => {
    const bg = transparent ? `bg-transparent` : `bg-[#1E364D]`;
    const ring = error ? `ring-1 ring-red-400` : '';
    const cn = `form-input ${bg} ${ring} ${className} disabled:bg-[#172C43] disabled:text-[#63809c]`;
    return (
      <div>
        <label
          htmlFor={label}
          className='my-2 inline-block text-lg capitalize text-white'
        >
          {label}
        </label>
        {description && <p className='mt-1 mb-2'>{description}</p>}
        <input ref={ref} className={cn} {...props} />
      </div>
    );
  }
);

export interface TextAreaProps
  extends React.ComponentPropsWithoutRef<'textarea'> {
  rows?: number;
  error?: string;
  transparent?: boolean;
  label?: string;
  description?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, transparent, description, label, ...props }, ref) => {
    const bg = transparent ? `bg-transparent` : `bg-[#1E364D]`;
    const ring = error ? `ring-1 ring-red-400` : '';
    const cn = `form-input ${bg} ${ring} ${className} disabled:bg-[#172C43] disabled:text-[#63809c]`;

    return (
      <div>
        <label
          htmlFor={label}
          className='my-2 inline-block text-lg capitalize text-white'
        >
          {label}
        </label>
        {description && <p className='mt-1 mb-2'>{description}</p>}
        <textarea ref={ref} className={cn} {...props} />
      </div>
    );
  }
);

Input.displayName = 'Input';
