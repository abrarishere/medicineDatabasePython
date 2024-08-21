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

    const { mrNumber, name, fatherName, gender, age, wardId, phoneNumber } = formData;

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
      <ToastContainer />
      <FaTimes className="absolute top-2 right-2 text-white cursor-pointer" onClick={onClose} />
      <div className="bg-gray-800 p-4 rounded-lg w-auto">
        <input
          className="p-2 rounded-lg w-full bg-gray-900 hover:bg-gray-700 mb-2 border-none focus:outline-none"
          type="number"
          placeholder="MR Number"
          name="mrNumber"
          value={formData.mrNumber} // Controlled input
          onChange={handleChange}
        />
        <input
          className="p-2 rounded-lg w-full bg-gray-900 hover:bg-gray-700 mb-2 border-none focus:outline-none"
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name} // Controlled input
          onChange={handleChange}
        />
        <input
          className="p-2 rounded-lg w-full bg-gray-900 hover:bg-gray-700 mb-2 border-none focus:outline-none"
          type="text"
          placeholder="Father Name"
          name="fatherName"
          value={formData.fatherName} // Controlled input
          onChange={handleChange}
        />
        <select
          className="p-2 rounded-lg w-full bg-gray-900 hover:bg-gray-700 mb-2 border-none focus:outline-none"
          name="gender"
          value={formData.gender} // Controlled input
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          className="p-2 rounded-lg w-full bg-gray-900 hover:bg-gray-700 mb-2 border-none focus:outline-none"
          type="number"
          placeholder="Age"
          name="age"
          value={formData.age} // Controlled input
          onChange={handleChange}
        />
        <select
          className="p-2 rounded-lg w-full bg-gray-900 hover:bg-gray-700 mb-2 border-none focus:outline-none"
          name="wardId"
          value={formData.wardId} // Controlled input
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
          className="p-2 rounded-lg w-full bg-gray-900 hover:bg-gray-700 mb-2 border-none focus:outline-none"
          type="number"
          placeholder="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber} // Controlled input
          onChange={handleChange}
        />
        <button className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-gray-700 mb-2" onClick={handleSubmit} disabled={loading}>
          {loading ? <MagnifyingGlass height="20" width="20" ariaLabel="loading" /> : "Add Patient"}
        </button>
      </div>
    </div>
  );
};

export default AddPatient;
