import dynamic from 'next/dynamic';

export default dynamic(() => import('react-highlight-words'), {
  ssr: false,

  loading: () => null,
});
