import { FaSearch } from "react-icons/fa";
import PatientMedicine from "../components/patientmedicine.home/patientmedicine.home";
import axios from "axios";
import { useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
import { FaHome } from "react-icons/fa";

const Home = () => {
  const [patient, setPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;
  const url = "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patients/mr";

  const getData = async (search) => {
    if (!search.trim()) {
      toast.error("Please enter a valid MRN.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${url}/${search}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
      if (response.data && response.data.length > 0) {
        setPatient(response.data);
        toast.success("Data fetched successfully.");
      } else {
        toast.warn("No data found for the given MRN.");
        setPatient(null);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#151515] text-white p-4">
      <ToastContainer />
      <div className="fixed top-4 left-4">
        <FaHome className="text-4xl cursor-pointer" onClick={() => window.location.reload()} />
      </div>
      <div className="flex flex-col items-center mt-20 gap-4">
        <div className="search flex gap-2 justify-center items-center rounded-lg bg-[#2f2f2f] text-white hover:bg-[#3f3f3f] active:bg-[#1f1f1f] overflow-hidden">
          <input
            type="text"
            placeholder="Search for a MRN"
            className="px-2 py-1 border-none bg-transparent focus:outline-none text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="p-4 hover:bg-[#3f3f3f] rounded-lg"
            onClick={() => getData(search)}
            disabled={!search.trim()}
          >
            <FaSearch />
          </button>
        </div>

        <div className="w-full min-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="magnifying-glass-loading"
                glassColor="#c0efff"
                color="#e15b64"
              />
            </div>
          ) : patient ? (
            <PatientMedicine patient={patient} />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>No data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
