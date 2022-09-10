import { Combobox } from '@headlessui/react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import { BsHouse } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';
import { Loader } from 'tabler-icons-react';
import usePlacesAutocomplete from 'use-places-autocomplete';

import { Alert, IconButton } from '@/features/UI';

declare type Libraries = (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[];
const libraries: Libraries = ['places'];

interface LocationSearchBoxProps {
  onSelectAddress: (address: string) => void;
}

export const LocationSearchBox = ({
  onSelectAddress,
}: LocationSearchBoxProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries,
  });

  if (loadError) return <Alert message='Bummer!' type='error' />;
  if (!isLoaded) return <Loader className='animate-spin' />;
  return (
    <div className='relative'>
      <label
        htmlFor='location'
        className='my-2 inline-block text-lg capitalize text-white'
      >
        City
      </label>

      <p className='mt-1 mb-2'>Search based on the name of your city.</p>

      <ReadySearchBox onSelectAddress={onSelectAddress} />
    </div>
  );
};

const ReadySearchBox = ({ onSelectAddress }: LocationSearchBoxProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });
  const [showClearIcon, setShowClearIcon] = useState(false);
  const handleSelect = async (address: string) => {
    setValue(address, false);
    onSelectAddress(address);
    clearSuggestions();
  };

  return (
    <div>
      <Combobox value={value} onChange={handleSelect} disabled={!ready}>
        <div className='relative flex justify-between'>
          <Combobox.Input
            className='w-full appearance-none rounded bg-[#1E364D] p-2 text-white outline-none placeholder:text-gray-500 focus:outline-none'
            onChange={(event) => {
              setValue(event.target.value);
              setShowClearIcon(true);
            }}
            placeholder='Search...'
          />
          {!showClearIcon ? (
            <span className='absolute right-2 top-3'>
              <MdLocationOn className='h-4 w-4' />
            </span>
          ) : (
            <span className='group absolute right-2 top-3.5'>
              <IconButton
                icon={
                  <svg
                    className='fill-current text-white transition-all ease-linear hover:rotate-90 hover:text-red-500'
                    width='12'
                    height='12'
                    viewBox='0 0 12 12'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M.566 1.698L0 1.13 1.132 0l.565.566L6 4.868 10.302.566 10.868 0 12 1.132l-.566.565L7.132 6l4.302 4.3.566.568L10.868 12l-.565-.566L6 7.132l-4.3 4.302L1.13 12 0 10.868l.566-.565L4.868 6 .566 1.698z'></path>
                  </svg>
                }
                onClick={() => {
                  setValue('');
                  setShowClearIcon(false);
                  clearSuggestions();
                }}
              />
            </span>
          )}
        </div>

        <Combobox.Options>
          {data.map((location) => (
            <Combobox.Option
              className='inline-flex w-full cursor-pointer appearance-none items-center gap-3 bg-[#1E364D] p-2 text-gray-300 outline-none placeholder:text-gray-500 hover:bg-brand-blue hover:text-white focus:outline-none'
              key={location.place_id}
              value={location.description}
            >
              <span>
                <BsHouse />
              </span>
              {location.description}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
      {status === 'ZERO_RESULTS' && <div>No results found</div>}
    </div>
  );
};
