import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

export const NextButton = () => {
  return (
    <button className='w-full inline-flex items-center text-center justify-center gap-4 group text-white border-3 border-gray-100/5 p-2.5 hover:text-[#4799eb]'>
      <span>Next Page</span>
      <span className='group-hover:animate-bounce-front-back'>
        <FaArrowRight />
      </span>
    </button>
  );
};
