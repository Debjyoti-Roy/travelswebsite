import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { BiError } from 'react-icons/bi';

const PaymentFailedModal = ({ onClose }) => {
  const backdropRef = React.useRef();

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md">
        {/* Red Banner */}
        <div className="bg-red-600 text-white text-center py-4 relative">
          <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
            <BiError size={22} className="text-white" />
            Payment Failed!
          </h2>
          <p className="text-sm">Your payment could not be processed. Please try again.</p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-300 transition"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="py-6 px-4 text-center">
          <p className="text-gray-700 text-sm mb-4">
            If the amount was deducted, it will be refunded within 5–7 business days.
          </p>

          <button
            onClick={onClose}
            className="mt-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedModal;
