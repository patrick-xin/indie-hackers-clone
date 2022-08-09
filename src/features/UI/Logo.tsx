import Image from 'next/future/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  hasName?: boolean;
  className?: string;
};
export const Logo = ({ hasName = true, className }: Props) => {
  return (
    <div className={`flex gap-2 items-center ${className ? className : ''}`}>
      {hasName && (
        <div>
          <Link href='/'>
            <a>INDIE HACKERS</a>
          </Link>
        </div>
      )}
      <div>
        <Image alt='logo' width={24} height={24} src='/logo.svg' />
      </div>
    </div>
  );
};
