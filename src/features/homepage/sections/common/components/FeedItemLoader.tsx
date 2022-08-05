import { motion } from 'framer-motion';
import React from 'react';

const FeedItemLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 }}
      className='border border-gray-300/10 shadow rounded-md p-4 w-full mx-auto'
    >
      <div className='animate-pulse flex space-x-4'>
        <div className='rounded-full bg-slate-700 h-10 w-10'></div>
        <div className='flex-1 space-y-6 py-1'>
          <div className='h-2 bg-slate-700 rounded'></div>
          <div className='space-y-3'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='h-2 bg-slate-700 rounded col-span-2'></div>
              <div className='h-2 bg-slate-700 rounded col-span-1'></div>
            </div>
            <div className='h-2 bg-slate-700 rounded'></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const FeedItemLoaders = ({ count }: { count: number }) => {
  return (
    <div className='mx-auto w-full grid grid-cols-1 gap-4 my-4'>
      {Array.from(Array(count).keys()).map((_, index) => (
        <FeedItemLoader key={index} />
      ))}
    </div>
  );
};
