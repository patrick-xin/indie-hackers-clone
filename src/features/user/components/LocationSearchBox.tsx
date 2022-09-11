import { Combobox, Transition } from '@headlessui/react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Fragment, useEffect, useState } from 'react';
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
  location: string;
}

export const LocationSearchBox = ({
  onSelectAddress,
  location,
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

      <ReadySearchBox onSelectAddress={onSelectAddress} location={location} />
    </div>
  );
};

const ReadySearchBox = ({
  onSelectAddress,
  location,
}: LocationSearchBoxProps) => {
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
  useEffect(() => {
    if (location) setValue(location);
  }, [location, setValue]);
  return (
    <div>
      <Combobox value={value} onChange={handleSelect} disabled={!ready}>
        <div className='relative flex justify-between'>
          <Combobox.Input
            className='form-input w-full'
            onChange={(event) => {
              setValue(event.target.value);
              setShowClearIcon(true);
            }}
            placeholder='Search...'
          />
          {!showClearIcon ? (
            <span className='absolute right-2 top-3 lg:top-4'>
              <MdLocationOn className='h-4 w-4' />
            </span>
          ) : (
            <span className='group absolute right-2 top-3.5 lg:top-4'>
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
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Combobox.Options className='absolute z-100 mt-0.5 flex max-h-60 flex-col overflow-auto rounded py-1 shadow-lg  focus:outline-none'>
            {data.map((location) => (
              <Combobox.Option
                className='combobox-option inline-flex w-full items-center gap-3'
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
        </Transition>
      </Combobox>
      {status === 'ZERO_RESULTS' && <div>No results found</div>}
    </div>
  );
};
