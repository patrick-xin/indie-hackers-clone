import { Combobox, Transition } from '@headlessui/react';
import cn from 'clsx';
import { Fragment, useMemo, useState } from 'react';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const days = Array.from({ length: 31 }, (v, i) => (i + 1).toString());
const getYears = () => {
  const start_year = new Date().getFullYear() - 13;
  const arr: string[] = [];
  for (let i = start_year; i > start_year - 78; i--) {
    arr.push(i.toString());
  }
  return arr;
};

interface SelectProps {
  items: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  placeholder: string;
  size?: 'small' | 'normal';
}

const Select = ({
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
  size = 'normal',
}: SelectProps) => {
  const [selectedItemInner, setSelectedItemInner] =
    useState<string>(selectedItem);
  const [query, setQuery] = useState('');
  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        );
  const handleChange = (value: string) => {
    setSelectedItemInner(value);
    setSelectedItem(value);
  };
  return (
    <Combobox value={selectedItemInner} onChange={handleChange}>
      <div className='relative'>
        <div
          className={cn({
            'w-16': size === 'small',
            'w-auto': size === 'normal',
          })}
        >
          <Combobox.Button className='w-full appearance-none'>
            <Combobox.Input
              placeholder={placeholder}
              className='form-input w-full'
              onChange={(event) => setQuery(event.target.value)}
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className='absolute z-100 mt-0.5 flex max-h-60 flex-col overflow-auto rounded py-1 shadow-lg  focus:outline-none'>
            {filteredItems.map((item, index) => (
              <Combobox.Option
                key={index}
                className='combobox-option'
                value={item}
              >
                <span>{item}</span>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export const BirthdaySelect = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const years = useMemo(() => getYears(), []);
  return (
    <div>
      <div className='my-2 inline-block text-lg capitalize text-white'>
        BIRTHDAY
      </div>
      <div className='flex items-center gap-4'>
        <Select
          placeholder='Month'
          items={months}
          selectedItem={selectedDay}
          setSelectedItem={setSelectedDay}
        />
        <Select
          size='small'
          placeholder='Day'
          items={days}
          selectedItem={selectedMonth}
          setSelectedItem={setSelectedMonth}
        />

        <Select
          size='small'
          placeholder='Year'
          items={years}
          selectedItem={selectedYear}
          setSelectedItem={setSelectedYear}
        />
      </div>
    </div>
  );
};
