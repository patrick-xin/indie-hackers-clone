import { useSession } from 'next-auth/react';

export const OnboardSection = () => {
  const { status } = useSession();
  return (
    <section className='mb-6 text-center md:my-8 md:min-h-[3rem]'>
      {status === 'authenticated' ? (
        <p className='text-lg text-white'>
          Welcome to the community! 👋 You&apos;re new here, but you can unlock
          special privileges by contributing to discussions.
        </p>
      ) : null}
    </section>
  );
};
