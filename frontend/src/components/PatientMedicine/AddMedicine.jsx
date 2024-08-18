import { FaPlus, FaMinus } from "react-icons/fa";
import { MagnifyingGlass } from "react-loader-spinner";


const AddMedicine = ({ medData, medicines, setMedicines, submitting, handleSubmit, isSubmitDisabled, handleAddRow, handleChange }) => {
  return (
      <div className="bg-gray-800 p-6 rounded-lg text-white">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaPlus /> Add Medicines
        </h2>
        {medData?.length ? (
          <div className="space-y-4">
            {medicines.map((medicine, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-4"
              >
                <select
                  name="medicine_id"
                  value={medicine.medicine_id}
                  onChange={(e) => handleChange(index, e)}
                  className="p-2 rounded bg-gray-700 text-white flex-1"
                >
                  <option value="">Select Medicine</option>
                  {medData.map((med) => (
                    <option key={med._id} value={med._id}>
                      {med.medicine_name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  value={medicine.quantity}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Quantity"
                  className="p-2 rounded bg-gray-700 text-white flex-1"
                />
                <input
                  type="date"
                  name="date"
                  value={medicine.date.split("T")[0]}
                  onChange={(e) => handleChange(index, e)}
                  className="hidden"
                />
                <button
                  onClick={() =>
                    setMedicines(medicines.filter((_, i) => i !== index))
                  }
                  className={`text-xl ${medicines.length > 1 ? "text-red-400" : "text-gray-500 cursor-not-allowed"}`}
                  disabled={medicines.length <= 1}
                >
                  <FaMinus />
                </button>
                <button
                  onClick={handleAddRow}
                  className="text-xl text-green-400"
                >
                  <FaPlus />
                </button>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded w-full flex justify-center items-center"
              disabled={isSubmitDisabled}
            >
              {submitting ? (
                <MagnifyingGlass
                  visible
                  height="24"
                  width="24"
                  ariaLabel="Submitting..."
                  color="#fff"
                />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            No medicine data available.
          </div>
        )}
      </div>
  )
}

export default AddMedicine
