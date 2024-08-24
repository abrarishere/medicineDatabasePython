import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MED_URL =
  `${BASE_URL}/medicines`;

const WARD_URL =
  `${BASE_URL}/wards`;


const PAT_URL =
  `${BASE_URL}/patients`;


const PAT_MED_URL =
  `${BASE_URL}/patient-medicines`;

function deleteMedicine(id) {
    return axios.delete(`${MED_URL}/${id}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function deleteWard(id) {
    return axios.delete(`${WARD_URL}/${id}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function deletePatient(id) {
    return axios.delete(`${PAT_URL}/${id}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function deletePatientMedicine(id) {
    return axios.delete(`${PAT_MED_URL}/${id}`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}


export { deleteMedicine, deleteWard, deletePatient, deletePatientMedicine };
