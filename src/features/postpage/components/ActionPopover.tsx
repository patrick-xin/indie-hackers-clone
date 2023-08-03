import { Popover } from '@headlessui/react';
import React from 'react';

type Props = {
  triggerIcon: React.ReactNode;
  buttonGroup: React.ReactNode;
  label?: string;
};
export const ActionPopover = ({ triggerIcon, buttonGroup, label }: Props) => {
  return (
    <Popover className='relative'>
      <Popover.Button className='inline-flex items-center justify-center gap-3 rounded border-2 border-gray-100/5 p-2.5 py-2 px-6 text-sm hover:text-green-500'>
        <span>{label}</span>
        <span>{triggerIcon}</span>
      </Popover.Button>

      <Popover.Panel className='absolute top-0 left-0 z-10 w-[12rem] rounded-lg'>
        <div className='divide-y-[1px] divide-gray-100/5'>{buttonGroup}</div>
      </Popover.Panel>
    </Popover>
  );
};
