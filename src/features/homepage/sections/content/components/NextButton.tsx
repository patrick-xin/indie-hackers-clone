import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

export const NextButton = () => {
  return (
    <button className='group inline-flex w-full items-center justify-center gap-4 border-3 border-gray-100/5 p-2.5 text-center text-white hover:text-[#4799eb]'>
      <span>Next Page</span>
      <span className='group-hover:animate-bounce-front-back'>
        <FaArrowRight />
      </span>
    </button>
  );
};
