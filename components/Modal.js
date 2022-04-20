import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FaTimesCircle, FaTimes } from 'react-icons/fa';
import { IoIosInformationCircle } from 'react-icons/io';

const Modal = React.forwardRef(({ title = 'modal title', children }, ref) => {
  const modalRefs = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const openHandler = () => {
    modalRefs.current.showModal();
    document?.querySelector('body')?.classList.add('open-modal');
    setIsOpen(true);
  };

  const closeHandler = () => {
    modalRefs.current.close();
    document?.querySelector('body')?.classList.remove('open-modal');
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      openHandler();
    },
    close: () => {
      closeHandler();
    },
  }));

  return (
    <dialog
      className='sm:w-2/3 w-auto overflow-hidden rounded shadow-lg shadow-slate-400/50 p-0 backdrop-blur-md'
      ref={modalRefs}
    >
      {isOpen && (
        <div className='parent'>
          <div className='header shadow-md bg-blue-100/50'>
            <div className='px-4 py-3'>
              <div className='flex justify-between'>
                <div className='flex gap-2 text-xl my-auto'>
                  <IoIosInformationCircle className='my-auto text-blue-500' />
                  <strong className='block'>{title}</strong>
                </div>
                <FaTimes
                  className='text-red-500 my-auto cursor-pointer hover:text-red-700'
                  onClick={closeHandler}
                  size='1.3rem'
                />
              </div>
            </div>
          </div>
          <div className='body border-y px-4 sm:py-8 py-4 overflow-y-auto max-h-[80vh]'>
            {children}
          </div>
          <div className='footer bg-slate-100/50 shadow-top'>
            <div className='py-2 px-4'>
              <div className='flex justify-end'>
                <button
                  onClick={closeHandler}
                  className='flex gap-2 bg-slate-300/50 p-1 px-8 rounded text-slate-500 hover:bg-slate-400/50'
                >
                  <FaTimesCircle className='my-auto' />
                  <span>Tutup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
});

Modal.displayName = 'Modal';

export default Modal;
