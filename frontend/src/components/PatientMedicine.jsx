import axios from 'axios';
import { useState, useEffect } from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';
import {
  FaUser,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaMale,
  FaFemale,
  FaCalendarAlt,
  FaClipboardList,
  FaBed,
  FaPlus,
  FaMinus,
} from 'react-icons/fa';

const PatientMedicine = ({ patient }) => {
  const [loading, setLoading] = useState(false);
  const [wardData, setWardData] = useState(null);
  const [medData, setMedData] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [medicines, setMedicines] = useState([{ medicine_id: '', quantity: 1, date: new Date().toISOString().split('T')[0] }]);
  const [submitting, setSubmitting] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;
  const url_wards = 'https://pharmacy-medicines-edc013fd241d.herokuapp.com/wards';
  const url_medicines = 'https://pharmacy-medicines-edc013fd241d.herokuapp.com/medicines';
  const url_patient_medicines = 'https://pharmacy-medicines-edc013fd241d.herokuapp.com/patient-medicines/create';

  useEffect(() => {
    if (patient?.length) {
      setLoading(true);
      axios.get(`${url_wards}/${patient[0].ward_id}`, { headers: { 'x-api-key': apiKey } })
        .then(({ data }) => setWardData(data))
        .catch(error => alert(`Error fetching ward data: ${error.message}`))
        .finally(() => setLoading(false));
    }
  }, [patient, apiKey]);

  useEffect(() => {
    setLoading(true);
    axios.get(url_medicines, { headers: { 'x-api-key': apiKey } })
      .then(({ data }) => setMedData(data))
      .catch(error => alert(`Error fetching medicine data: ${error.message}`))
      .finally(() => setLoading(false));
  }, [apiKey]);

  const handleAddRow = () => setMedicines([...medicines, { medicine_id: '', quantity: 1, date: new Date().toISOString().split('T')[0] }]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newMedicines = [...medicines];
    newMedicines[index][name] = value;
    setMedicines(newMedicines);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    Promise.all(medicines.map(medicine =>
      axios.post(url_patient_medicines, {
        mr_number: patient[0].mr_number,
        medicine_id: medicine.medicine_id,
        quantity: medicine.quantity,
        date: medicine.date,
      }, { headers: { 'x-api-key': apiKey } })
    ))
      .then(() => {
        setMedicines([{ medicine_id: '', quantity: 1, date: new Date().toISOString().split('T')[0] }]);
        alert('Medicines added successfully.');
      })
      .catch(error => alert(`Error submitting medicines: ${error.message}`))
      .finally(() => setSubmitting(false));
  };

  if (!patient?.length) return <div className="text-center text-gray-400">No patient data available.</div>;

  const { mr_number, name, father_name, gender, age, phone_number, created_at, updated_at } = patient[0];
  const { ward_name } = wardData || {};
  const formattedCreatedAt = new Date(created_at).toLocaleString();
  const formattedUpdatedAt = new Date(updated_at).toLocaleString();

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-800 p-6 rounded-lg text-white mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaUser /> Patient Details
          </h2>
          <button onClick={() => setDetailsVisible(!detailsVisible)} className="text-xl">
            {detailsVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <MagnifyingGlass visible height="60" width="60" ariaLabel="Loading..." color="#00bfff" />
          </div>
        ) : (
          detailsVisible && (
            <div className="text-sm flex flex-col gap-2">
              <p className="flex items-center gap-2"><FaClipboardList className="text-gray-400" /> <span className="font-bold">MR Number:</span> {mr_number}</p>
              <p className="flex items-center gap-2"><FaUser className="text-gray-400" /> <span className="font-bold">Name:</span> {name}</p>
              <p className="flex items-center gap-2"><FaUser className="text-gray-400" /> <span className="font-bold">Father&rsquo;s Name:</span> {father_name}</p>
              <p className="flex items-center gap-2">{gender === 'Male' ? <FaMale className="text-blue-400" /> : <FaFemale className="text-pink-400" />} <span className="font-bold">Gender:</span> {gender}</p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400" /> <span className="font-bold">Age:</span> {age}</p>
              <p className="flex items-center gap-2"><FaBed className="text-gray-400" /> <span className="font-bold">Ward Name:</span> {ward_name || 'N/A'}</p>
              <p className="flex items-center gap-2"><FaPhone className="text-gray-400" /> <span className="font-bold">Phone Number:</span> {phone_number}</p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400" /> <span className="font-bold">Created At:</span> {formattedCreatedAt}</p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400" /> <span className="font-bold">Updated At:</span> {formattedUpdatedAt}</p>
            </div>
          )
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg text-white">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaPlus /> Add Medicines
        </h2>
        {medData?.length ? (
          <div className="space-y-4">
            {medicines.map((medicine, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-4">
                <select name="medicine_id" value={medicine.medicine_id} onChange={(e) => handleChange(index, e)} className="p-2 rounded bg-gray-700 text-white flex-1">
                  <option value="">Select Medicine</option>
                  {medData.map((med) => (
                    <option key={med._id} value={med._id}>{med.medicine_name}</option>
                  ))}
                </select>
                <input type="number" name="quantity" value={medicine.quantity} onChange={(e) => handleChange(index, e)} placeholder="Quantity" className="p-2 rounded bg-gray-700 text-white flex-1" />
                <input type="date" name="date" value={medicine.date} onChange={(e) => handleChange(index, e)} className="hidden" />
                <button onClick={() => setMedicines(medicines.filter((_, i) => i !== index))} className={`text-xl ${medicines.length > 1 ? 'text-red-400' : 'text-gray-500 cursor-not-allowed'}`} disabled={medicines.length <= 1}>
                  <FaMinus />
                </button>
                <button onClick={handleAddRow} className="text-xl text-green-400">
                  <FaPlus />
                </button>
              </div>
            ))}
            <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded w-full flex justify-center items-center" disabled={submitting}>
              {submitting ? <MagnifyingGlass visible height="24" width="24" ariaLabel="Submitting..." color="#fff" /> : 'Submit'}
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-400">No medicine data available.</div>
        )}
      </div>
    </div>
  );
};

export default PatientMedicine;
