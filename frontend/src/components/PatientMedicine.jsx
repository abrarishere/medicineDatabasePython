import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddMedicine from "./PatientMedicine/AddMedicine";
import PatientDetails from "./PatientMedicine/PatientDetails";
import { MagnifyingGlass } from "react-loader-spinner";

const PatientMedicine = ({ patient }) => {
  const [loading, setLoading] = useState(false);
  const [wardData, setWardData] = useState(null);
  const [medData, setMedData] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [medicines, setMedicines] = useState([
    {
      medicine_id: "",
      quantity: 1,
      date: new Date().toISOString(),
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;
  const url_wards =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/wards";
  const url_medicines =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/medicines";
  const url_patient_medicines =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patient-medicines/create";

  // Fetch ward data based on patient's ward_id
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${url_wards}/${patient[0].ward_id}`, {
        headers: { "x-api-key": apiKey },
      })
      .then(({ data }) => setWardData(data))
      .catch((error) =>
        toast.error(`Error fetching ward data: ${error.message}`),
      )
      .finally(() => setLoading(false));
  }, [patient, apiKey]);

  // Fetch all available medicines
  useEffect(() => {
    setLoading(true);
    axios
      .get(url_medicines, { headers: { "x-api-key": apiKey } })
      .then(({ data }) => setMedData(data))
      .catch((error) =>
        toast.error(`Error fetching medicine data: ${error.message}`),
      )
      .finally(() => setLoading(false));
  }, [apiKey]);

  // Handle adding a new row for medicine input
  const handleAddRow = () =>
    setMedicines([
      ...medicines,
      { medicine_id: "", quantity: 1, date: new Date().toISOString() },
    ]);

  // Handle input changes for medicines
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newMedicines = [...medicines];
    newMedicines[index][name] = value;
    setMedicines(newMedicines);
  };

  // Handle form submission to add medicines
  const handleSubmit = () => {
    setSubmitting(true);
    Promise.all(
      medicines.map((medicine) =>
        axios.post(
          url_patient_medicines,
          {
            mr_number: patient[0].mr_number,
            medicine_id: medicine.medicine_id,
            quantity: medicine.quantity,
            date: medicine.date,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
          },
        ),
      ),
    )
      .then(() => {
        setMedicines([
          { medicine_id: "", quantity: 1, date: new Date().toISOString() },
        ]);
        toast.success("Medicines added successfully.");
        // Reload Page
        window.location.reload();
      })
      .catch((error) => {
        toast.error(`Error submitting medicines: ${error}`);
        console.error(error);
      })
      .finally(() => setSubmitting(false));
  };

  // Disable submit button if any medicine ID is missing or if the form is submitting
  const isSubmitDisabled =
    submitting || medicines.some((medicine) => !medicine.medicine_id);

  // Destructure patient data for easy access
  const {
    mr_number,
    name,
    father_name,
    gender,
    age,
    phone_number,
    created_at,
    updated_at,
  } = patient[0];
  const { ward_name } = wardData || {};
  const formattedCreatedAt = new Date(created_at).toLocaleString();
  const formattedUpdatedAt = new Date(updated_at).toLocaleString();

  return (
    <div className="container mx-auto p-6">
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
          <PatientDetails
            patient={patient}
            wardData={wardData}
            detailsVisible={detailsVisible}
            setDetailsVisible={setDetailsVisible}
            mr_number={mr_number}
            name={name}
            father_name={father_name}
            gender={gender}
            age={age}
            phone_number={phone_number}
            ward_name={ward_name}
            created_at={created_at}
            updated_at={updated_at}
            formattedCreatedAt={formattedCreatedAt}
            formattedUpdatedAt={formattedUpdatedAt}
          />

          <AddMedicine
            medData={medData}
            medicines={medicines}
            setMedicines={setMedicines}
            handleAddRow={handleAddRow}
            handleChange={handleChange}
            isSubmitDisabled={isSubmitDisabled}
            handleSubmit={handleSubmit}
            submitting={submitting}
          />
        </>
      )}
    </div>
  );
};

export default PatientMedicine;
