import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaInfo } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchWards, fetchWardPatients } from "../../../functions/Fetch";
import PatientDetails from "../Commons/PatientDetails";
import { deleteWard } from "../../../functions/Delete";
import { MagnifyingGlass } from "react-loader-spinner";

const Wards = () => {
  const [wards, setWards] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    const loadWards = async () => {
      setLoading(true); // Start loading
      try {
        const { data: wardsData } = await fetchWards();
        const wardsWithPatientCounts = await Promise.all(
          wardsData.map(async (ward) => {
            const { data: patientsData } = await fetchWardPatients(ward._id);
            return { ...ward, patientCount: patientsData.length };
          })
        );
        setWards(wardsWithPatientCounts);
      } catch (error) {
        toast.error("Failed to fetch wards");
        console.error("Error fetching wards:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    loadWards();
  }, []);

  const handleInfoClick = async (wardId) => {
    try {
      setLoading(true); // Start loading
      const { data } = await fetchWardPatients(wardId);
      setSelectedPatients(data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch ward patients");
      console.error("Error fetching ward patients:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDeleteClick = (wardId) => {
    if (window.confirm("Are you sure you want to delete this ward?")) {
      setLoading(true); // Start loading
      deleteWard(wardId)
        .then((response) => {
          if (response.success) {
            toast.success("Ward deleted successfully");
            setWards((prevWards) =>
              prevWards.filter((ward) => ward._id !== wardId)
            );
          } else {
            toast.error("Failed to delete ward");
          }
        })
        .catch((error) => {
          toast.error("Error deleting ward");
          console.error("Error deleting ward:", error);
        })
        .finally(() => setLoading(false)); // End loading
    }
  };

  const handleDoubleClick = (wardId) => {
    navigator.clipboard.writeText(wardId)
      .then(() => {
        toast.success("Ward ID copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy Ward ID");
        console.error("Error copying to clipboard:", error);
      });
  };

  return (
    <div className="container w-full min-h-screen flex flex-col text-white p-4">
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
                <button>
                  <FaPlus className="text-2xl text-white" />
                </button>
              </div>
              <h2 className="text-md font-semibold">Add Ward</h2>
            </div>
            {wards.map(({ _id, ward_name, patientCount }) => (
              <div
                key={_id}
                className="p-4 bg-gray-800 text-white flex flex-col justify-between items-start gap-2 rounded-lg shadow-md h-32 relative cursor-pointer"
                onDoubleClick={() => handleDoubleClick(_id)}
              >
                <h2 className="text-md font-semibold">{ward_name}</h2>
                <p className="text-sm">Patients: {patientCount}</p>
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <button
                    className="bg-gray-600 text-white p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
                    onClick={() => handleInfoClick(_id)}
                  >
                    <FaInfo className="text-sm" />
                  </button>
                  <button
                    className="bg-gray-600 text-white p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
                    onClick={() => handleDeleteClick(_id)}
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
        </>
      )}
    </div>
  );
};

export default Wards;
