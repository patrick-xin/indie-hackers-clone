import cn from 'clsx';
import React from 'react';

type Props = {
  className?: string;
  dir?: 'row' | 'col';
  center?: boolean;
  children: React.ReactNode;
};

export const Flex: React.FC<Props> = ({
  className,
  dir = 'row',
  center,
  children,
}) => {
  return (
    <div
      className={cn(`flex`, className && `${className}`, {
        'items-center justify-center': center,
        'flex-row': dir === 'row',
        'flex-col': dir === 'col',
      })}
    >
      {children}
    </div>
  );
};
