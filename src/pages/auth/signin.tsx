import { GetServerSideProps } from 'next';
import { Provider } from 'next-auth/providers';
import { getProviders, signIn } from 'next-auth/react';

type Props = {
  providers: Provider[];
};

const SignInPage = ({ providers }: Props) => {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() => {
              signIn(provider.id, {
                callbackUrl: '/',
              });
              //router.push(router.query.callbackUrl);
            }}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
};

export default SignInPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
