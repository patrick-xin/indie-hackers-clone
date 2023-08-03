import cn from 'clsx';

type Props = {
  className: string;
};
export const XIcon = ({ className }: Props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={cn('fill-current', className)}
    >
      <path d='M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z' />
    </svg>
  );
};
