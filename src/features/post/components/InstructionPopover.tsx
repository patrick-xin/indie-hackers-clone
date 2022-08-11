import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { Ad2, X } from 'tabler-icons-react';

import { IconButton } from '@/features/UI';

export const InstructionPopover = () => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement);
  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        <Ad2 className='hover:text-white' />
      </Popover.Button>

      <Popover.Panel
        className='z-100'
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {({ close }: { close: () => void }) => (
          <div className='w-96 p-4 bg-[#0C1F31] space-y-4 rounded-sm z-100 relative'>
            <div className='absolute right-4 top-4 hover:rotate-90'>
              <IconButton icon={<X />} onClick={close} />
            </div>

            <div className='space-y-4 px-6'>
              <ul className='list-disc space-y-3'>
                <li>Separate paragraphs with blank lines.</li>
                <li>
                  Italicize text by surrounding it with asterisks * or
                  underscores _.
                </li>
                <li>
                  Bold text by surrounding it with double asterisks ** or double
                  underscores __.
                </li>

                <li>Prefix lists with numbers 1. or hyphens -.</li>
                <li>Prefix quotes with a greater-than sign &gt;.</li>
                <li>
                  Write code by indenting 4 spaces or surrounding it with
                  backticks `.
                </li>
                <li>Use Markdown for images and links.</li>
              </ul>
            </div>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  );
};
