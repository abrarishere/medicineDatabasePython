import axios from "axios";
import { useState, useEffect } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaUser, FaEye, FaEyeSlash, FaPhone, FaMale, FaFemale, FaCalendarAlt, FaClipboardList, FaBed } from "react-icons/fa";

const PatientMedicine = ({ patient }) => {
  const [loading, setLoading] = useState(false);
  const [wardData, setWardData] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(true);
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = "https://pharmacy-medicines-edc013fd241d.herokuapp.com/wards";

  useEffect(() => {
    if (patient?.length) {
      setLoading(true);
      axios
        .get(`${url}/${patient[0].ward_id}`, { headers: { "x-api-key": apiKey } })
        .then(({ data }) => setWardData(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [patient, apiKey]);

  if (!patient?.length) return <div className="text-center text-gray-400">No patient data available.</div>;

  let { mr_number, name, father_name, gender, age, phone_number, created_at, updated_at } = patient[0];
  const { ward_name } = wardData || {};
  created_at = new Date(created_at).toLocaleString();
  updated_at = new Date(updated_at).toLocaleString();

  return (
    <div className="bg-[#2f2f2f] p-4 rounded-lg flex flex-col gap-4 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaUser /> Patient Details
        </h2>
        <button onClick={() => setDetailsVisible(!detailsVisible)} className="text-xl">
          {detailsVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <MagnifyingGlass visible={true} height="60" width="60" ariaLabel="Loading..." color="#00bfff" />
        </div>
      ) : (
        detailsVisible && (
          <div className="text-sm flex flex-col gap-2">
            <p className="flex items-center gap-2">
              <FaClipboardList className="text-gray-400" /> <span className="font-bold">MR Number:</span> {mr_number}
            </p>
            <p className="flex items-center gap-2">
              <FaUser className="text-gray-400" /> <span className="font-bold">Name:</span> {name}
            </p>
            <p className="flex items-center gap-2">
              <FaUser className="text-gray-400" /> <span className="font-bold">Father's Name:</span> {father_name}
            </p>
            <p className="flex items-center gap-2">
              {gender === "Male" ? <FaMale className="text-blue-400" /> : <FaFemale className="text-pink-400" />}{" "}
              <span className="font-bold">Gender:</span> {gender}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" /> <span className="font-bold">Age:</span> {age}
            </p>
            <p className="flex items-center gap-2">
              <FaBed className="text-gray-400" /> <span className="font-bold">Ward Name:</span> {ward_name || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-gray-400" /> <span className="font-bold">Phone Number:</span> {phone_number}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" /> <span className="font-bold">Created At:</span> {created_at}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" /> <span className="font-bold">Updated At:</span> {updated_at}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default PatientMedicine;
