import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  fetchMedicines,
  fetchMedicinePatients,
} from "../../../functions/Fetch";
import PatientDetails from "../Commons/PatientDetails";
import { deleteMedicine } from "../../../functions/Delete";
import AddMedicine from "./AddMedicine";
import MedicineCard from "./MedicineCard";
import { MagnifyingGlass } from "react-loader-spinner";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] =
    useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedicines = async () => {
      setLoading(true);
      try {
        const response = await fetchMedicines();
        const medicinesWithPatients = await Promise.all(
          response.data.map(async (medicine) => {
            try {
              const patientsResponse = await fetchMedicinePatients(medicine._id);
              return {
                ...medicine,
                patientsCount: patientsResponse.data.length,
                patients: patientsResponse.data,
              };
            } catch (error) {
              if (error.response && error.response.status === 404) {
                return {
                  ...medicine,
                  patientsCount: 0,
                  patients: [],
                };
              } else {
                throw error;
              }
            }
          })
        );
        setMedicines(medicinesWithPatients);
      } catch (error) {
        toast.error("Failed to fetch medicines or patients");
        console.error("Error fetching medicines or patients:", error);
      } finally {
        setLoading(false); 
      }
    };

    loadMedicines();
  }, []);

  const handleInfoClick = (patients) => {
    setSelectedPatients(patients);
    setIsPatientDetailsModalOpen(true);
  };

  const handleDeleteClick = async (medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        const response = await deleteMedicine(medicineId);
        if (response.status === 200) {
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
    navigator.clipboard
      .writeText(medicineId)
      .then(() => {
        toast.success("Medicine ID copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy Medicine ID");
        console.error("Error copying to clipboard:", error);
      });
  };

  return (
    <div className="container w-full min-h-screen flex flex-col p-4">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            ariaLabel="Magnifying Glass loading"
            glassColor="#c0efff"
            color="#e15b64"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800 flex flex-col justify-center items-center gap-2 rounded-lg shadow-md h-32 w-full relative">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full">
              <button onClick={() => setIsAddMedicineModalOpen(true)}>
                <FaPlus className="text-2xl text-white" />
              </button>
            </div>
            <h4 className="text-white text-lg font-semibold">Add Medicine</h4>
          </div>
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine._id}
              medicine={medicine}
              handleInfoClick={handleInfoClick}
              handleDeleteClick={handleDeleteClick}
              handleDoubleClick={handleDoubleClick}
            />
          ))}
        </div>
      )}

      {isPatientDetailsModalOpen && (
        <PatientDetails
          patients={selectedPatients}
          onClose={() => setIsPatientDetailsModalOpen(false)}
        />
      )}

      {isAddMedicineModalOpen && (
        <AddMedicine setIsAddMedicineModalOpen={setIsAddMedicineModalOpen} />
      )}
    </div>
  );
};

export default Medicines;
