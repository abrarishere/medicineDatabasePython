import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MED_URL =
  `${BASE_URL}/medicines`;

const WARD_URL =
  `${BASE_URL}/wards`;


const PAT_URL =
  `${BASE_URL}/patients`;

const PAT_MED_URL =
  `${BASE_URL}/patient-medicines`;


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

function fetchUniquePatientMedicines(id) {
    return axios.get(`${PAT_URL}/${id}/medicines`, {
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

export { fetchMedicines, fetchMedicineById, fetchMedicinePatients, fetchWards, fetchWardById, fetchWardPatients, fetchPatients, fetchPatientByMRN, fetchUniquePatientMedicines, fetchPatientMedicines };
