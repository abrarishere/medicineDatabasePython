import {
  FaUser,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaMale,
  FaFemale,
  FaCalendarAlt,
  FaClipboardList,
  FaBed,
} from "react-icons/fa";
import { MagnifyingGlass } from "react-loader-spinner";

const PatientDetails = ({
  loading,
  detailsVisible,
  setDetailsVisible,
  mr_number,
  name,
  father_name,
  gender,
  age,
  phone_number,
  ward_name,
  formattedCreatedAt,
  formattedUpdatedAt,
}) => (
  <div className="bg-gray-800 p-6 rounded-lg text-white mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FaUser /> Patient Details
      </h2>
      <button
        onClick={() => setDetailsVisible(!detailsVisible)}
        className="text-sm p-2"
      >
        {detailsVisible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>

    <div className="mb-4">
      <p className="text-sm text-gray-300">Patient Name: <span className="font-semibold">{name}</span></p>
    </div>

    {loading ? (
      <div className="flex justify-center">
        <MagnifyingGlass
          visible
          height="50"
          width="50"
          ariaLabel="Loading..."
          color="#00bfff"
        />
      </div>
    ) : (
      detailsVisible && (
        <table className="min-w-full text-xs text-left text-gray-400">
          <tbody>
            {[
              { icon: <FaClipboardList />, label: "MR Number", value: mr_number },
              { icon: <FaUser />, label: "Name", value: name },
              { icon: <FaUser />, label: "Father’s Name", value: father_name },
              {
                icon: gender === "Male" ? <FaMale /> : <FaFemale />,
                label: "Gender",
                value: gender,
              },
              { icon: <FaCalendarAlt />, label: "Age", value: age },
              { icon: <FaBed />, label: "Ward Name", value: ward_name || "N/A" },
              { icon: <FaPhone />, label: "Phone Number", value: phone_number },
              { icon: <FaCalendarAlt />, label: "Created At", value: formattedCreatedAt },
              { icon: <FaCalendarAlt />, label: "Updated At", value: formattedUpdatedAt },
            ].map(({ icon, label, value }) => (
              <tr key={label} className="border-b border-gray-700">
                <td className="px-4 py-2 flex items-center gap-2 text-white">
                  <span className="text-gray-400">{icon}</span>
                  <span className="font-bold">{label}:</span>
                </td>
                <td className="px-4 py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    )}
  </div>
);

export default PatientDetails;
