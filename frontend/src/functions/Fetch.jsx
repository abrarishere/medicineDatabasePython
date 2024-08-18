import axios from "axios";

const MED_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/medicines";

const WARD_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/wards";


const PAT_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patients";


const API_KEY = import.meta.env.VITE_API_KEY;

function fetchMedicines() {
    return axios.get(MED_URL, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchMedicinePatients(id) {
    return axios.get(`${MED_URL}/${id}/patients`, {
        headers: {
            'x-api-key': API_KEY
        }
    });
}

function fetchWards() {
    return axios.get(WARD_URL, {
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

export { fetchMedicines, fetchPatients, fetchWards, fetchMedicinePatients, fetchWardPatients };
