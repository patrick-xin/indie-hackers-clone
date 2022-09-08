import Link from 'next/link';
import { useSession } from 'next-auth/react';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  return (
    <>
      {session ? <>{children}</> : <Link href='/auth/signin'>{children}</Link>}
    </>
  );
};
