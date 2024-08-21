import { FaTrash } from "react-icons/fa";
import { fetchMedicineById} from "../../../functions/Fetch";
import { useState, useEffect } from "react";

const PatientMedicineCard = ({ patientMedicine, handleDoubleClick, handleDeleteClick }) => {
  const [medicine, setMedicine] = useState(null);

  const fetchMedicine = async () => {
    try {
      const response = await fetchMedicineById(patientMedicine.medicine_id);
      setMedicine(response.data);
    } catch (error) {
      console.error("Error fetching medicine: ", error);
    }
  }

  useEffect(() => {
    fetchMedicine();
  } , []);


  const formatDate = (date) => new Date(date).toLocaleString('en-US');

  return (
    <div
      className="p-4 bg-gray-800 text-white flex flex-col justify-between items-start gap-2 rounded-lg shadow-md h-40 w-full relative cursor-pointer"
      onDoubleClick={() => handleDoubleClick(patientMedicine._id)}
    >
      <div>
        <p className="text-sm"> Medicine Name: {medicine?.medicine_name}</p>
        <p className="text-sm">Quantity: {patientMedicine.quantity}</p>
        <p className="text-sm">Date: {formatDate(patientMedicine.date)}</p>
        <p className="text-sm">MRN: {patientMedicine.mr_number}</p>
        <p className="text-sm">Medicine ID: {medicine?._id}</p>
      </div>
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <button
          className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-all duration-200"
          onClick={() => handleDeleteClick(patientMedicine._id)}
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default PatientMedicineCard;
