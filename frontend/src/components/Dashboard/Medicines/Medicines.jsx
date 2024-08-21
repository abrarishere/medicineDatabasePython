import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchMedicines, fetchMedicinePatients } from "../../../functions/Fetch";
import PatientDetails from "../Commons/PatientDetails";
import { deleteMedicine } from "../../../functions/Delete";
import AddMedicine from "./AddMedicine";
import MedicineCard from "./MedicineCard";
import { MagnifyingGlass } from "react-loader-spinner";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const response = await fetchMedicines();
      const medicinesWithPatients = await Promise.all(response.data.map(async (medicine) => {
        try {
          const patientsResponse = await fetchMedicinePatients(medicine._id);
          return { ...medicine, patientsCount: patientsResponse.data.length, patients: patientsResponse.data };
        } catch (error) {
          if (error.response?.status === 404) return { ...medicine, patientsCount: 0, patients: [] };
          throw error;
        }
      }));
      setMedicines(medicinesWithPatients);
      setFilteredMedicines(medicinesWithPatients);
    } catch {
      toast.error("Failed to fetch medicines or patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMedicines(); }, []);

  useEffect(() => {
    const filtered = medicines.filter(medicine => {
      const searchLower = searchQuery.toLowerCase();
      return (
        medicine.medicine_name.toLowerCase().includes(searchLower) ||
        medicine._id.toLowerCase().includes(searchLower) ||
        medicine.quantity.toString().includes(searchLower)
      );
    });
    setFilteredMedicines(filtered);
  }, [searchQuery, medicines]);

  const handleInfoClick = (patients) => {
    setSelectedPatients(patients);
    setIsPatientDetailsModalOpen(true);
  };

  const handleDeleteClick = (medicineId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this medicine?',
      buttons: [
        { label: 'Yes', onClick: async () => {
          try {
            const { status } = await deleteMedicine(medicineId);
            status === 200 ? toast.success("Medicine deleted") : toast.error("Failed to delete medicine");
            if (status === 200) loadMedicines();
          } catch {
            toast.error("Error deleting medicine");
          }
        }},
        { label: 'No' }
      ]
    });
  };

  const handleDoubleClick = (medicineId) => {
    navigator.clipboard.writeText(medicineId)
      .then(() => toast.success("Medicine ID copied"))
      .catch(() => toast.error("Failed to copy Medicine ID"));
  };

  return (
    <div className="container w-full min-h-screen flex flex-col p-4">
      <ToastContainer />
      <div className="flex items-center mb-4 p-2 bg-gray-700 rounded-md">
        <input
          type="text"
          placeholder="Search by name, ID, or date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none focus:outline-none rounded-lg px-2 py-1 w-full bg-transparent text-white"
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <MagnifyingGlass visible={true} height="80" width="80" glassColor="#c0efff" color="#e15b64" />
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
          {filteredMedicines.map((medicine) => (
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
        <AddMedicine
          setIsAddMedicineModalOpen={setIsAddMedicineModalOpen}
          refreshMedicines={loadMedicines}
        />
      )}
    </div>
  );
};

export default Medicines;
