import Link from 'next/link';
import React from 'react';

export const Footer = () => {
  return (
    <footer className='border-t border-gray-300 px-6 mt-12'>
      <div className='py-12 text-center'>
        <h2>Stay informed as an indie hacker.</h2>
        <p>Market insights that help you start and grow your business.</p>
        <input type='text' placeholder='Email address' />
      </div>
      <div>
        <div className='grid grid-cols-3 px-6 mx-auto text-center'>
          <div>
            <h3>COMMUNITY</h3>
            {Array.from([1, 2, 3, 4]).map((i) => (
              <div key={i}>
                <Link href='/'>
                  <a>link</a>
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h3>LEARN</h3>
            {Array.from([1, 2, 3, 4]).map((i) => (
              <div key={i}>
                <Link href='/'>
                  <a>link</a>
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h3>PRODUCTS</h3>
            {Array.from([1, 2, 3, 4]).map((i) => (
              <div key={i}>
                <Link href='/'>
                  <a>link</a>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className='py-12'>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            ut temporibus beatae inventore hic quae dicta tempora neque, nisi
            eveniet!
          </p>
        </div>
      </div>
    </footer>
  );
};
