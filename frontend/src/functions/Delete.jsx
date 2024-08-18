import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

const MED_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/medicines";

const WARD_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/wards";


const PAT_URL =
    "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patients";


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

export { deleteMedicine, deleteWard };