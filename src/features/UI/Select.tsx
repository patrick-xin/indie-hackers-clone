import { Listbox, Transition } from '@headlessui/react';
import cn from 'clsx';
import { Fragment } from 'react';
import { BsChevronBarExpand } from 'react-icons/bs';
interface SelectProps {
  options: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  size?: 'small' | 'normal';
  label: string;
}

export const Select = ({
  selectedItem,
  setSelectedItem,
  options,
  size = 'small',
  label,
}: SelectProps) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='text-lg text-white'>{label}</div>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <div
          className={cn('relative mt-1', {
            'w-24': size === 'small',
            'w-32': size === 'normal',
          })}
        >
          <Listbox.Button className='form-input text-left'>
            <span className='block truncate'>{selectedItem}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronBarExpand
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options
              className={cn(
                'absolute z-100 mt-0.5 flex max-h-60 flex-col overflow-auto rounded py-1 shadow-lg focus:outline-none',
                {
                  'w-24': size === 'small',
                  'w-32': size === 'normal',
                }
              )}
            >
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `combobox-option ${
                      active ? 'bg-brand-blue text-white' : ''
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected
                            ? 'font-medium text-brand-blue hover:text-white'
                            : 'font-normal'
                        }`}
                      >
                        {option}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
