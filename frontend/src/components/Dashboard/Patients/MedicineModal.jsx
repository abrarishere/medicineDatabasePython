import React from 'react';

const MedicineModal = ({ isOpen, onClose, medicines }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-700  p-5 rounded">
        <h2 className="text-xl font-bold mb-4">Medicines</h2>
        {medicines.length > 0 ? (
          <ul>
            {medicines.map((medicine, index) => (
              <li key={index} className="mb-2">
                {medicine.medicine_name} - {medicine.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medicines found for this patient.</p>
        )}
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default MedicineModal;
