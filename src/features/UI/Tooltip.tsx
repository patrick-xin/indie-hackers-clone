import React, { useState } from 'react';
import { usePopper } from 'react-popper';

export const Tooltip = () => {
  const [referenceElement, setReferenceElement] =
    useState<null | HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<null | HTMLDivElement>(
    null
  );
  const [arrowElement, setArrowElement] = useState<null | HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'arrow',

        options: { element: arrowElement, padding: -4 },
      },
    ],
  });
  return (
    <div className='w-48'>
      <button
        type='button'
        onMouseEnter={() => setShow(true)}
        ref={setReferenceElement}
      >
        Reference element
      </button>
      {show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          Popper element
          <div
            ref={setArrowElement}
            style={styles.arrow}
            className='triangle'
          />
        </div>
      )}
    </div>
  );
};
