import { toast, ToastContainer } from "react-toastify";
import { MagnifyingGlass } from "react-loader-spinner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { fetchPatients } from "../../../functions/Fetch";
import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import { deletePatient } from "../../../functions/Delete";
import { FaPlus } from "react-icons/fa";
import AddPatient from "./AddPatient";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await fetchPatients();
      setPatients(response.data);
    } catch {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = (id) => {
    navigator.clipboard.writeText(id).then(
      () => toast.success("Copied to clipboard"),
      () => toast.error("Failed to copy to clipboard")
    );
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deletePatient(id);
              toast.success("Patient deleted successfully");
              loadPatients();
            } catch {
              toast.error("Failed to delete patient");
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="container w-full min-h-screen flex flex-col p-4 text-white">
      <ToastContainer />
      
      <div className="flex justify-end w-full mb-4">
        <button
          className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-200"
          onClick={() => setIsAddPatientModalOpen(true)}
        >
          <FaPlus />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            glassColor="#c0efff"
            color="#e15b64"
          />
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="overflow-auto">
            <table className="w-full table-auto text-left whitespace-no-wrap">
              <thead className="bg-gray-800 text-gray-400 uppercase text-xs leading-normal">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">MRN</th>
                  <th className="py-3 px-4">Ward</th>
                  <th className="py-3 px-4">Medicines</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4">Updated At</th>
                  <th className="py-3 px-4">Delete</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {patients.length > 0 ? (
                  patients.map((item, index) => (
                    <PatientCard
                      key={index}
                      patient={item}
                      handleDoubleClick={handleDoubleClick}
                      handleDelete={handleDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isAddPatientModalOpen && (
        <AddPatient
          onClose={() => setIsAddPatientModalOpen(false)}
          onPatientAdded={loadPatients}
        />
      )}
    </div>
  );
};

export default Patients;
