import { useRouter } from 'next/router';
import NProgress, { NProgressOptions } from 'nprogress';
import React from 'react';

export function Progressbar({
  startPosition = 0.3,
  stopDelayMs = 200,
  showOnShallow = true,
  options,
}: {
  startPosition?: number;
  stopDelayMs?: number;
  showOnShallow?: boolean;
  options?: NProgressOptions;
}) {
  let timer: NodeJS.Timeout | null = null;
  const router = useRouter();

  React.useEffect(() => {
    if (router.pathname === '/search') return;
    if (options) {
      NProgress.configure(options);
    }
    router.events.on('routeChangeStart', routeChangeStart);
    router.events.on('routeChangeComplete', routeChangeEnd);
    router.events.on('routeChangeError', routeChangeEnd);
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeEnd);
      router.events.off('routeChangeError', routeChangeEnd);
    };
    // eslint-disable-next-line
  }, [router]);

  const routeChangeStart = (
    _url: string,
    { shallow }: { shallow: boolean }
  ) => {
    if (!shallow || showOnShallow) {
      NProgress.set(startPosition);
      NProgress.start();
    }
  };

  const routeChangeEnd = (_url: string, { shallow }: { shallow: boolean }) => {
    if (!shallow || showOnShallow) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.done(true);
      }, stopDelayMs);
    }
  };

  return <></>;
}
