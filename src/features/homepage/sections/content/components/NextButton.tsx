import { FaArrowRight } from 'react-icons/fa';

export const NextButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='group inline-flex w-fit items-center justify-center gap-2 p-2.5 text-center text-lg text-white hover:text-[#4799eb]'
    >
      <span>Next Page</span>
      <span className='mt-0.5 inline-block group-hover:animate-bounce-front-back'>
        <FaArrowRight />
      </span>
    </button>
  );
};
