import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { addPatient } from "../../../functions/Add";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaTimes } from "react-icons/fa";
import { fetchWards } from "../../../functions/Fetch";

const AddPatient = ({ onClose, onPatientAdded }) => {
  const [formData, setFormData] = useState({
    mrNumber: "", // Initializing with an empty string makes it controlled
    name: "",
    fatherName: "",
    gender: "",
    age: "",
    wardId: "",
    phoneNumber: "",
  });

  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWards()
      .then((response) => setWards(response.data))
      .catch(() => toast.error("Failed to fetch wards"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { mrNumber, name, fatherName, gender, age, wardId, phoneNumber } =
      formData;

    if (!name || !fatherName || !gender || !age || !wardId || !phoneNumber) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    const patientData = {
      mr_number: mrNumber || Math.floor(Math.random() * 1000000),
      name,
      father_name: fatherName,
      gender,
      age,
      ward_id: wardId,
      phone_number: phoneNumber,
    };

    try {
      await addPatient(patientData);
      toast.success("Patient added successfully");
      onPatientAdded();
      onClose();
    } catch (error) {
      toast.error("Failed to add patient");
      console.log(`Error from AddPatient: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="bg-gray-800 p-6 rounded-lg w-auto max-w-md mx-4">
        <div className="flex justify-end items-center mb-4">
          <FaTimes
            className="text-white cursor-pointer bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors"
            onClick={onClose}
            size={32}
            aria-label="Close"
          />
        </div>
        <input
          className="p-3 rounded-md w-full bg-gray-900 hover:bg-gray-700 mb-3 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="MR Number (Optional)"
          name="mrNumber"
          value={formData.mrNumber}
          onChange={handleChange}
        />
        <input
          className="p-3 rounded-md w-full bg-gray-900 hover:bg-gray-700 mb-3 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          className="p-3 rounded-md w-full bg-gray-900 hover:bg-gray-700 mb-3 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Father Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
        />
        <select
          className="p-3 rounded-md w-full bg-gray-900 hover:bg-gray-700 mb-3 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          className="p-3 rounded-md w-full bg-gray-900 hover:bg-gray-700 mb-3 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
        <select
          className="p-3 rounded-md w-full bg-gray-900 hover:bg-gray-700 mb-3 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="wardId"
          value={formData.wardId}
          onChange={handleChange}
        >
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward._id} value={ward._id}>
              {ward.ward_name}
            </option>
          ))}
        </select>
        <input
          className="p-3 rounded-md w-full bg-gray-900 hover:bg-gray-700 mb-3 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <button
          className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <MagnifyingGlass height="20" width="20" ariaLabel="loading" />
          ) : (
            "Add Patient"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddPatient;
