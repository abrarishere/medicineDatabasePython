import { useState, useEffect } from "react";
import { fetchWardById, fetchPatientMedicines } from "../../../functions/Fetch";
import { MagnifyingGlass } from "react-loader-spinner";
import MedicineModal from "./MedicineModal";
import { FaTrash } from "react-icons/fa";

const PatientCard = ({ patient, handleDoubleClick, handleDelete }) => {
  const [wardName, setWardName] = useState("");
  const [patientMedicines, setPatientMedicines] = useState([]);
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [loading, isloading] = useState(false);

  const getWardName = async () => {
    try {
      const response = await fetchWardById(patient.ward_id);
      setWardName(response.data.ward_name);
    } catch (error) {
      setWardName("N/A");
      console.log(error.message);
    }
  }

  const getPatientMedicines = async () => {
    isloading(true);
    try {
      
      const response = await fetchPatientMedicines(patient._id);
      setPatientMedicines(response.data);
      isloading(false);
    } catch (error) {
      isloading(false);
      console.log(error.message);
    }
  }

  const formatDate = (date) => { return new Date(date).toLocaleString('en-US');} 


  useEffect(() => {
    getWardName();
    getPatientMedicines();
  }, []);

  return (
    <>
      <tr className="hover:bg-gray-700" onDoubleClick={() => handleDoubleClick(patient._id)}>
        <td className="p-2">{patient.name}</td>
        <td className="p-2">{patient.father_name}</td>
        <td className="p-2">{patient.age}</td>
        <td className="p-2">{patient.gender}</td>
        <td className="p-2">{patient.phone_number}</td>
        <td className="p-2">{patient.mr_number}</td>
        <td className="p-2">{wardName}</td>
        <td className="p-2">
          <button className="border-none px-1 py-1 hover:bg-[#1e1e1d33]" onClick={() => setIsMedicineModalOpen(true)}>
            View
          </button>
        </td>
        <td className="text-[12px]">{formatDate(patient.created_at)}</td>
        <td className="text-[12px]">{formatDate(patient.updated_at)}</td>
        <td className="p-2">
          <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(patient._id)} />
        </td>
      </tr>

      {isMedicineModalOpen && (
        <MedicineModal
          isOpen={isMedicineModalOpen}
          onClose={() => setIsMedicineModalOpen(false)}
          medicines={patientMedicines}
        />
      )}

      {loading && (
        <div className="flex justify-center items-center">
          <MagnifyingGlass 
            visible={true} 
            height="50" 
            width="50" 
            ariaLabel="MagnifyingGlass-loading" 
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor='#c0efff'
            color='#1e1e1d' 
          />
        </div>
      )}

    </>
  );
};

export default PatientCard;
