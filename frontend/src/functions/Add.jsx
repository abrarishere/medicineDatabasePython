import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const MED_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/medicines/create";

const WARD_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/wards/create";


const PAT_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patients/create";


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

export { addMedicine, addWard };
