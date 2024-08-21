import axios from "axios";

const MED_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/medicines";

const WARD_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/wards";


const PAT_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patients";

const PAT_MED_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patient-medicines";


const API_KEY = import.meta.env.VITE_API_KEY;

function fetchMedicines() {
    return axios.get(MED_URL, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchMedicineById(id) {
    return axios.get(`${MED_URL}/${id}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

async function fetchMedicinePatients(id) {
  try {
        return await axios.get(`${MED_URL}/${id}/patients`, {
            headers: {
                'x-api-key': API_KEY
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { data: [] }; // Return an empty array if 404
        }
        throw error;
    }
}

function fetchWards() {
    return axios.get(WARD_URL, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchWardById(id) {
    return axios.get(`${WARD_URL}/${id}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchWardPatients(id) {
    return axios.get(`${WARD_URL}/${id}/patients`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchPatients() {
    return axios.get(PAT_URL, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchPatientByMRN(mrn) {
    return axios.get(`${PAT_URL}/mr/${mrn}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchPatientMedicines() {
    return axios.get(`${PAT_MED_URL}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

export { fetchMedicines, fetchMedicineById, fetchMedicinePatients, fetchWards, fetchWardById, fetchWardPatients, fetchPatients, fetchPatientByMRN, fetchPatientMedicines };
