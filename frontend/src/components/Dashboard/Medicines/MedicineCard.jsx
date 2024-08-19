import { FaInfo, FaTrash } from "react-icons/fa";

const MedicineCard = ({ medicine, handleDoubleClick, handleInfoClick, handleDeleteClick }) => {
  return (
    <div
      className="p-4 bg-gray-800 text-white flex flex-col justify-between items-start gap-2 rounded-lg shadow-md h-32 w-full relative cursor-pointer"
      onDoubleClick={() => handleDoubleClick(medicine._id)}
    >
      <div>
        <h2 className="text-md font-semibold">{medicine.medicine_name}</h2>
        <p className="text-sm">Quantity: {medicine.quantity}</p>
        <p className="text-sm">Patients: {medicine.patientsCount}</p>
      </div>
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <button
          className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-all duration-200"
          onClick={() => handleInfoClick(medicine.patients)}
        >
          <FaInfo className="text-sm" />
        </button>
        <button
          className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-all duration-200"
          onClick={() => handleDeleteClick(medicine._id)}
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
