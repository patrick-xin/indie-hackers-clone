import React from 'react';

import { Footer, Header } from '../UI';

export const PostPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className='post'>
      <Header isTransparent />
      <main>
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
};
