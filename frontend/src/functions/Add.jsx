import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MED_URL =
    `${BASE_URL}/medicines/create`;

const WARD_URL =
  `${BASE_URL}/wards/create`;


const PAT_URL =
  `${BASE_URL}/patients/create`;


function addMedicine(data) {
    return axios.post(MED_URL, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    });
}

function addWard(data) {
    return axios.post(WARD_URL, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    });
}

function addPatient(data) {
    return axios.post(PAT_URL, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    });
}

export { addMedicine, addWard, addPatient };
