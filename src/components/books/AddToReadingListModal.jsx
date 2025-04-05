// src/components/books/AddToReadingListModal.jsx
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useReadingLists } from '../../hooks/useReadingLists';

const AddToReadingListModal = ({ book, readingLists, loading, onClose }) => {
  const { addBookToReadingList } = useReadingLists();
  const navigate = useNavigate();
  const [selectedListId, setSelectedListId] = useState(null);
  const [notes, setNotes] = useState('');

  const handleAdd = async () => {
    if (!selectedListId) return;
    try {
      await addBookToReadingList(selectedListId, book._id || book.googleBooksId, notes);
      onClose();
      navigate(`/reading-lists/${selectedListId}`);
    } catch (err) {
      console.error('Failed to add book:', err);
    }
  };

  return (
    <Transition show={true} as={Fragment}>
      <Dialog onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">Add to Reading List</Dialog.Title>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <p className="text-gray-600">Loading your reading lists...</p>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select a list:
                  </label>
                  <select
                    value={selectedListId || ''}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="">Choose one</option>
                    {readingLists.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Notes (optional)
                  </label>
                  <textarea
                    className="form-input w-full"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button onClick={onClose} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleAdd} className="btn btn-primary flex items-center">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddToReadingListModal;
