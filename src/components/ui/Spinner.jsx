// src/components/ui/Spinner.jsx
const Spinner = ({ size = 'medium' }) => {
    const sizeClasses = {
      small: 'w-4 h-4 border-2',
      medium: 'w-8 h-8 border-2',
      large: 'w-12 h-12 border-4',
    };
  
    return (
      <div className={`animate-spin rounded-full border-t-transparent border-gray-300 border-solid ${sizeClasses[size]}`} />
    );
  };
  
  export default Spinner;
  