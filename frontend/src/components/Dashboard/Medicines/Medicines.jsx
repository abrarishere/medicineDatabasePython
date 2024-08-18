import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaInfo } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchMedicines, fetchMedicinePatients } from "../../../functions/Fetch";
import PatientDetails from "../Commons/PatientDetails";
import { deleteMedicine } from "../../../functions/Delete";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const response = await fetchMedicines();
        const medicinesWithPatients = await Promise.all(
          response.data.map(async (medicine) => {
            const patientsResponse = await fetchMedicinePatients(medicine._id);
            return { ...medicine, patientsCount: patientsResponse.data.length, patients: patientsResponse.data };
          })
        );
        setMedicines(medicinesWithPatients);
      } catch (error) {
        toast.error("Failed to fetch medicines or patients");
        console.error("Error fetching medicines or patients:", error);
      }
    };

    loadMedicines();
  }, []);

  const handleInfoClick = (patients) => {
    setSelectedPatients(patients);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        const response = await deleteMedicine(medicineId);
        if (response.success) {
          toast.success("Medicine deleted successfully");
          setMedicines((prevMedicines) =>
            prevMedicines.filter((medicine) => medicine._id !== medicineId)
          );
        } else {
          toast.error("Failed to delete medicine");
        }
      } catch (error) {
        toast.error("Error deleting medicine");
        console.error("Error deleting medicine:", error);
      }
    }
  };

  const handleDoubleClick = (medicineId) => {
    navigator.clipboard.writeText(medicineId)
      .then(() => {
        toast.success("Medicine ID copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy Medicine ID");
        console.error("Error copying to clipboard:", error);
      });
  };

  return (
    <div className="container w-full min-h-screen flex flex-col bg-gray-900 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 flex flex-col justify-center items-center gap-2 rounded-lg shadow-md h-32 w-full relative">
          <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full">
            <FaPlus className="text-2xl text-white" />
          </div>
          <button className="bg-blue-600 text-white p-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200">
            Add Medicine
          </button>
        </div>
        {medicines.map((medicine) => (
          <div
            key={medicine._id}
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
        ))}
      </div>

      {isModalOpen && (
        <PatientDetails 
          patients={selectedPatients} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Medicines;
