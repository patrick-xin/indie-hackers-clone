import { useSession } from 'next-auth/react';
import React from 'react';

export const OnboardSection = () => {
  const { status } = useSession();
  return (
    <section className='pt-8 text-center min-h-12'>
      {status === 'authenticated' ? (
        <p className='text-white text-lg'>
          Welcome to the community! 👋 You&apos;re new here, but you can unlock
          special privileges by contributing to discussions.
        </p>
      ) : null}
    </section>
  );
};
