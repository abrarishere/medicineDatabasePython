import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addMedicine } from '../../../functions/Add';

const AddMedicine = ({ setIsAddMedicineModalOpen, refreshMedicines }) => {
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicineName || quantity <= 0) return toast.error('Invalid input');

    try {
      const { status, message } = await addMedicine({ medicine_name: medicineName, quantity: Number(quantity) });
      status === 201 ? toast.success('Medicine added') : toast.error(message || 'Failed to add medicine');
      if (status === 201) {
        await refreshMedicines();
        setIsAddMedicineModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error adding medicine');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
        <div className="flex justify-end">
          <button onClick={() => setIsAddMedicineModalOpen(false)} className="text-red-500 hover:text-red-700">
            <FaTimes />
          </button>
        </div>
        <h2 className="text-lg font-semibold">Add Medicine</h2>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Medicine Name"
            className="p-2 border bg-gray-700 rounded-lg text-white"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="p-2 border bg-gray-700 rounded-lg text-white"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
          <button type="submit" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700">
            Add Medicine
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
