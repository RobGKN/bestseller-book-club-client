// src/components/ui/ConfirmDialog.jsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onCancel} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
            <div className="flex items-center space-x-4 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            </div>
            <div className="mb-4 text-gray-700">{message}</div>
            <div className="flex justify-end space-x-3">
              <button onClick={onCancel} className="btn btn-secondary">
                {cancelLabel || 'Cancel'}
              </button>
              <button onClick={onConfirm} className="btn btn-primary">
                {confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmDialog;
