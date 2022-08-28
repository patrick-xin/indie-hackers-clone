import { GetServerSideProps } from 'next';
import Image from 'next/future/image';
import { Provider } from 'next-auth/providers';
import { getProviders, signIn } from 'next-auth/react';
import { ReactElement } from 'react';

import { BasicLayout } from '@/features/layout/Basic';

type Props = {
  providers: Provider[];
};

const buttonMap: {
  [key: string]: { imgSrc: string; bg: string };
} = {
  GitHub: {
    imgSrc: '/auth-icon__github.svg',
    bg: 'bg-gray-300',
  },
  Google: {
    imgSrc: '/auth-icon__google.svg',
    bg: 'bg-white',
  },
  Credentials: {
    imgSrc: '/auth-icon__twitter.svg',
    bg: 'bg-blue-500',
  },
};

const SignInPage = ({ providers }: Props) => {
  return (
    <div className='mx-auto max-w-4xl rounded px-8'>
      <div className='grid grid-cols-1'>
        <div>
          <h2 className='bg-[#274059] p-6 text-2xl text-white md:text-3xl'>
            Join a thriving community of entrepreneurs and developers.
          </h2>
          <div className='space-y-4 bg-[#1E364D] p-4'>
            <div className='flex items-center gap-2'>
              <div>
                <Image src='/shop.png' width={60} height={60} />
              </div>

              <p>Connect with other indie hackers running online businesses.</p>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <Image src='/chat-boxes.png' width={60} height={60} />
              </div>

              <p>
                Get feedback on your business ideas, landing pages, and more.
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <Image src='/newsletter.png' width={50} height={50} />
              </div>

              <p>Get the best new stories from founders in your inbox.</p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-6 space-y-4'>
        <h3 className='text-2xl'>Sign in with</h3>
        <div className='flex items-center gap-4'>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className={`flex h-10 w-10 items-center justify-center rounded-full p-2.5 transition-colors ease-linear hover:bg-opacity-80 ${
                  buttonMap[provider.name].bg
                }`}
                onClick={() => {
                  signIn(provider.id, {
                    callbackUrl: '/',
                  });
                  //router.push(router.query.callbackUrl);
                }}
              >
                <Image
                  src={buttonMap[provider.name].imgSrc}
                  width={24}
                  height={24}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
SignInPage.getLayout = (page: ReactElement) => (
  <BasicLayout>{page}</BasicLayout>
);
export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
