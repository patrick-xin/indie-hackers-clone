import cn from 'clsx';

type Props = {
  label: string;
  position?: 'right' | 'bottom';
};
export const NavTooltip = ({ label, position = 'right' }: Props) => {
  return (
    <div
      className={cn(
        'absolute -top-0.5 hidden w-max rounded bg-brand-blue p-1.5 text-sm group-hover:block  group-hover:animate-fade-in',
        {
          'group-hover:translate-x-[95%]': position === 'right',
          'group-hover:translate-y-[95%]': position === 'bottom',
        }
      )}
    >
      {label}
      {position === 'right' && (
        <div className='left-tran absolute top-2.5 -left-1.5' />
      )}
      {position === 'bottom' && (
        <div className='left-tran absolute -top-1.5 left-7 rotate-90' />
      )}
    </div>
  );
};
