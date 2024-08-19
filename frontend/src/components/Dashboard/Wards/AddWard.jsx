import { addWard } from "../../../functions/Add";
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddWard = ({ onClose, onWardAdded }) => {
  const [wardName, setWardName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wardName) return toast.error('Invalid input');

    try {
      const { status, message } = await addWard({ ward_name: wardName });
      if (status === 201) {
        toast.success('Ward added');
        setWardName('');
        onWardAdded();  // Notify the parent to reload the wards
        onClose();  // Close the modal
      } else {
        toast.error(message || 'Failed to add ward');
      }
    } catch {
      toast.error('Error adding ward');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <FaTimes />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Add Ward</h2>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ward Name"
            className="p-2 border bg-gray-700 rounded-lg text-white"
            value={wardName}
            onChange={(e) => setWardName(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700">
            Add Ward
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWard;
