import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { fetchWards, fetchWardPatients } from "../../../functions/Fetch";
import PatientDetails from "../Commons/PatientDetails";
import { deleteWard } from "../../../functions/Delete";
import { MagnifyingGlass } from "react-loader-spinner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import WardCard from "./WardCard";
import AddWard from "./AddWard";

const Wards = () => {
  const [wards, setWards] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] = useState(false);
  const [isAddWardModalOpen, setIsAddWardModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadWards = useCallback(async () => {
    setLoading(true);
    try {
      const { data: wardsData } = await fetchWards();
      const wardsWithPatientCounts = await Promise.all(
        wardsData.map(async (ward) => {
          try {
            const { data: patientsData } = await fetchWardPatients(ward._id);
            return {
              ...ward,
              patientCount: patientsData.length,
              patients: patientsData,
            };
          } catch (error) {
            if (error.response?.status === 404) {
              return { ...ward, patientCount: 0, patients: [] };
            }
            throw error;
          }
        })
      );
      setWards(wardsWithPatientCounts);
    } catch (error) {
      toast.error("Failed to fetch wards or patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWards();
  }, [loadWards]);

  useEffect(() => {
    const filtered = wards.filter((ward) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        ward.ward_name.toLowerCase().includes(searchLower) ||
        ward._id.toLowerCase().includes(searchLower) ||
        ward.patientCount.toString().includes(searchLower)
      );
    });
    setFilteredWards(filtered);
  }, [searchQuery, wards]);

  const handleInfoClick = (patients) => {
    setSelectedPatients(patients);
    setIsPatientDetailsModalOpen(true);
  };

  const handleDeleteClick = (wardId) => {
    if (!wardId) {
      toast.error("Invalid ID");
      return;
    }

    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this ward?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const { status } = await deleteWard(wardId);
              status === 200
                ? toast.success("Ward deleted")
                : toast.error("Failed to delete ward");
              if (status === 200) loadWards();
            } catch {
              toast.error("Error deleting ward");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleDoubleClick = (wardId) => {
    navigator.clipboard
      .writeText(wardId)
      .then(() => toast.success("Ward ID copied"))
      .catch(() => toast.error("Failed to copy Ward ID"));
  };

  return (
    <div className="container w-full min-h-screen flex flex-col text-white p-4">
      <ToastContainer />
      <div className="flex items-center mb-4 p-2 bg-gray-700 rounded-md">
        <input
          type="text"
          placeholder="Search by name, ID, or patient count"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none focus:outline-none rounded-lg px-2 py-1 w-full bg-transparent text-white"
        />
      </div>
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800 flex flex-col justify-center items-center gap-2 rounded-lg shadow-md h-32 relative">
              <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full">
                <button onClick={() => setIsAddWardModalOpen(true)}>
                  <FaPlus className="text-2xl text-white" />
                </button>
              </div>
              <h2 className="text-md font-semibold">Add Ward</h2>
            </div>
            {filteredWards.map(({ _id, ward_name, patientCount, patients }) => (
              <WardCard
                key={_id}
                wardId={_id}
                ward_name={ward_name}
                patientCount={patientCount}
                patients={patients}
                handleInfoClick={handleInfoClick}
                handleDeleteClick={handleDeleteClick}
                handleDoubleClick={handleDoubleClick}
              />
            ))}
          </div>

          {isPatientDetailsModalOpen && (
            <PatientDetails
              patients={selectedPatients}
              onClose={() => setIsPatientDetailsModalOpen(false)}
            />
          )}

          {isAddWardModalOpen && (
            <AddWard
              onClose={() => setIsAddWardModalOpen(false)}
              onWardAdded={loadWards}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Wards;
