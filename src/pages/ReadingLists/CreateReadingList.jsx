import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadingLists } from '../../hooks/useReadingLists';
import { useForm } from 'react-hook-form';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

const CreateReadingList = () => {
  const navigate = useNavigate();
  const { createReadingList } = useReadingLists();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      isPublic: true,
    },
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const newList = await createReadingList(data);
      toast.success('Reading list created successfully!');
      navigate(`/reading-lists/${newList._id}`);
    } catch (error) {
      toast.error('Failed to create reading list');
      console.error('Create reading list error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Reading List</h1>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="My Favorite Sci-Fi Books"
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { 
                    value: 100, 
                    message: 'Title cannot exceed 100 characters' 
                  } 
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                className={`form-input ${errors.description ? 'border-red-500' : ''}`}
                placeholder="A collection of my favorite science fiction novels..."
                {...register('description', { 
                  maxLength: { 
                    value: 500, 
                    message: 'Description cannot exceed 500 characters' 
                  } 
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-primary-600 rounded"
                  {...register('isPublic')}
                />
                <span className="ml-2 text-gray-700">Make this reading list public</span>
              </label>
              <p className="text-gray-500 text-sm mt-1">
                Public reading lists can be seen and followed by other users
              </p>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner size="small" /> : 'Create Reading List'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReadingList;