import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addMedicine } from '../../../functions/Add';

const AddMedicine = ({ setIsAddMedicineModalOpen }) => {
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicineName || quantity <= 0) {
      return toast.error('Please fill in all fields with valid values');
    }

    const data = {
      medicine_name: medicineName,
      quantity: Number(quantity),
    };

    try {
      const response = await addMedicine(data);
      if (response.status === 201) {
        toast.success('Medicine added successfully');
        setIsAddMedicineModalOpen(false);
      } else {
        toast.error(response.message || 'Failed to add medicine');
      }
    } catch (error) {
      toast.error('Error adding medicine');
      console.error('Error adding medicine:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddMedicineModalOpen(false)}
            className="text-red-500 hover:text-red-700 transition-all duration-200"
          >
            <FaTimes />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Add Medicine</h2>
        <form className="grid grid-cols-1 gap-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Medicine Name"
            className="p-2 border border-gray-600 bg-gray-700 rounded-lg text-white"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="p-2 border border-gray-600 bg-gray-700 rounded-lg text-white"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1" 
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Add Medicine
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
