import cn from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import { ChevronsRight } from 'tabler-icons-react';

import { DASHBOARD_NAV_LINKS } from '@/lib/constants';

import { NavTooltip } from '@/features/dashboad/components';
import { Flex, Logo } from '@/features/UI';

export const CollapsedNav = ({
  onClose,
  shown,
}: {
  onClose: () => void;
  shown: boolean;
}) => {
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: shown ? 0 : 1 }}
          animate={{
            opacity: shown ? 1 : 0,
            transition: { easings: [0.8, 0, 1, 1] },
          }}
          className='fixed shadow inset-0 w-[60px] bg-[#1E364D] text-sm text-gray-300'
        >
          <div className='h-full w-full relative flex justify-center'>
            <div>
              <button
                className='absolute inline-block -right-3 group top-24 p-0.5 text-gray-100 rounded-full bg-[#63809c]'
                onClick={onClose}
              >
                <ChevronsRight className='h-4 w-4' />
              </button>
            </div>

            <div className='h-full space-y-10 w-full'>
              <Flex className='my-10 justify-center'>
                <Logo hasName={false} />
              </Flex>

              <ul className='space-y-6'>
                {DASHBOARD_NAV_LINKS['top'].map((link) => (
                  <CollapsedNavLink
                    key={link.label}
                    {...link}
                    active={link.label === 'my likes'}
                  />
                ))}
              </ul>
              <ul className='space-y-6 py-8'>
                {DASHBOARD_NAV_LINKS['bottom'].map((link) => (
                  <CollapsedNavLink
                    key={link.label}
                    {...link}
                    active={link.label === 'my likes'}
                  />
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CollapsedNavLink = ({
  icons,
  href,
  label,
  active,
  isButton,
}: {
  icons: React.ReactNode;
  href?: string;
  label: string;
  active: boolean;
  isButton?: boolean;
}) => {
  return (
    <li
      className={cn('p-1 hover:text-white capitalize', {
        'border-l border-lime-300': active,
      })}
    >
      {!isButton && href ? (
        <div className='group relative flex justify-center'>
          <Link href={href}>
            <a>
              <div>{icons}</div>
            </a>
          </Link>
          <NavTooltip label={label} />
        </div>
      ) : (
        <div className='group relative flex justify-center'>
          <button>{icons}</button>
          <NavTooltip label={label} />
        </div>
      )}
    </li>
  );
};
