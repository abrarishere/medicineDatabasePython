import { FaSearch } from "react-icons/fa";
import PatientMedicine from "../components/PatientMedicine";
import axios from "axios";
import { useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";

const Home = () => {
  const [patient, setPatient] = useState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;
  const url = "https://pharmacy-medicines-edc013fd241d.herokuapp.com/patients/mr";

  const getData = async (search) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/${search}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
      setPatient(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center bg-[#151515] text-white p-4 overflow-hidden">
      <div className="flex flex-col items-center mt-20 gap-4">
        <div className="search flex gap-2 justify-center items-center rounded-lg bg-[#2f2f2f] p-2 text-white hover:bg-[#3f3f3f] active:bg-[#1f1f1f]">
          <input
            type="text"
            placeholder="Search for a MRN"
            className="px-2 py-1 border-none bg-transparent focus:outline-none text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="px-2 py-1 hover:bg-[#3f3f3f] rounded-lg"
            onClick={() => getData(search)}
            disabled={!search}
          >
            <FaSearch />
          </button>
        </div>
        <div className="w-full h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="magnifying-glass-loading"
                wrapperStyle={{}}
                wrapperClass="magnifying-glass-wrapper"
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
