import { motion } from 'framer-motion';
import React from 'react';

const FeedItemLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 }}
      className='mx-auto w-full rounded-md border border-gray-300/10 p-4 shadow'
    >
      <div className='flex animate-pulse space-x-4'>
        <div className='h-10 w-10 rounded-full bg-slate-700'></div>
        <div className='flex-1 space-y-6 py-1'>
          <div className='h-2 rounded bg-slate-700'></div>
          <div className='space-y-3'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-2 h-2 rounded bg-slate-700'></div>
              <div className='col-span-1 h-2 rounded bg-slate-700'></div>
            </div>
            <div className='h-2 rounded bg-slate-700'></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const FeedItemLoaders = ({ count }: { count: number }) => {
  return (
    <div className='mx-auto my-4 grid w-full grid-cols-1 gap-4'>
      {Array.from(Array(count).keys()).map((_, index) => (
        <FeedItemLoader key={index} />
      ))}
    </div>
  );
};
