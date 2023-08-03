import cn from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';
import { ChevronsLeft } from 'tabler-icons-react';

import { DASHBOARD_NAV_LINKS } from '@/lib/constants';

import { ButtonLink, Flex, Logo } from '@/features/UI';
import { useMe } from '@/features/user/auth/api';
import { ProfileMenuDropdown } from '@/features/user/auth/components';

export const MainNav = ({
  onClose,
  shown,
}: {
  onClose: () => void;
  shown: boolean;
}) => {
  const router = useRouter();
  const { data } = useMe({});

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: shown ? 0 : 1 }}
          animate={{
            opacity: shown ? 1 : 0,
            transition: { easings: [0.8, 0, 1, 1] },
          }}
          exit={{ opacity: shown ? 0 : 1 }}
          className='fixed inset-0 w-64 bg-[#1E364D] text-sm text-gray-300 shadow'
        >
          <div className='relative h-full w-full'>
            <div>
              <button
                className='group absolute -right-3 top-12 inline-block rounded-full bg-[#63809c] p-0.5 text-gray-100'
                onClick={onClose}
              >
                <ChevronsLeft className='h-4 w-4' />
              </button>
            </div>
            <div className='h-full w-full space-y-10'>
              <Flex className='my-10 justify-center'>
                <Logo hasName className='flex-row-reverse' />
              </Flex>
              <div className='flex h-full flex-col justify-between'>
                <ul className='space-y-1 py-8'>
                  {DASHBOARD_NAV_LINKS['top'].map((link) => (
                    <MainNavLink
                      key={link.label}
                      {...link}
                      active={router.pathname.endsWith(link.path)}
                    />
                  ))}
                </ul>

                <ul className='space-y-1 py-8'>
                  {DASHBOARD_NAV_LINKS['bottom'].map((link) => (
                    <MainNavLink
                      key={link.label}
                      {...link}
                      active={
                        link.path ? router.pathname.endsWith(link.path) : false
                      }
                      isButton={link.label === 'logout'}
                    />
                  ))}
                </ul>
                <div className='mb-32 flex justify-center'>
                  {data && (
                    <ProfileMenuDropdown
                      arrow='bottom'
                      user={data.user}
                      notificationsCounts={data.notificationsCounts}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MainNavLink = ({
  label,
  icons,
  href,
  active,
  isButton = false,
}: {
  label: string;
  icons: React.ReactNode;
  href?: string;
  active: boolean;
  isButton?: boolean;
}) => {
  return (
    <li
      className={cn(
        'mx-auto p-1 px-10 text-sm font-bold hover:text-white capitalize group',
        {
          'border-l border-lime-500 bg-blue-100/5 px-9': active,
        }
      )}
    >
      {!isButton && href ? (
        <ButtonLink
          icon={icons}
          variant='ghost'
          href={href}
          className='flex-row-reverse gap-4 p-1 text-lg text-brand-text group-hover:text-white'
        >
          {label}
        </ButtonLink>
      ) : (
        <button className='inline-flex gap-4 p-2 text-lg capitalize text-brand-text group-hover:text-white'>
          <span>{icons}</span>
          <span> {label}</span>
        </button>
      )}
    </li>
  );
};
