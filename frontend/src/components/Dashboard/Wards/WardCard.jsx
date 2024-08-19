import { FaTrash, FaInfo } from "react-icons/fa";

const WardCard = ({ ward_name, patientCount, patients, handleInfoClick, handleDeleteClick, handleDoubleClick, wardId }) => {
  return (
    <div
      className="p-4 bg-gray-800 text-white flex flex-col justify-between items-start gap-2 rounded-lg shadow-md h-32 relative cursor-pointer"
      onDoubleClick={() => handleDoubleClick(wardId)} // Pass the correct wardId
    >
      <h2 className="text-md font-semibold">{ward_name}</h2>
      <p className="text-sm">Patients: {patientCount}</p>
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <button
          className="bg-gray-600 text-white p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
          onClick={() => handleInfoClick(patients)}
        >
          <FaInfo className="text-sm" />
        </button>
        <button
          className="bg-gray-600 text-white p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
          onClick={() => handleDeleteClick(wardId)}
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default WardCard;
