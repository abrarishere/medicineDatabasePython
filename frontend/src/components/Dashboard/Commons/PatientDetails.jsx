const PatientDetails = ({ patients, onClose }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full text-white shadow-lg">
      <h2 className="text-2xl mb-4 font-semibold">Patient Details</h2>
      <div className="overflow-y-auto max-h-80">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="p-4 text-left">MR Number</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Father's Name</th>
              <th className="p-4 text-left">Gender</th>
              <th className="p-4 text-left">Age</th>
              <th className="p-4 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient._id} className="bg-gray-800 border-b border-gray-600 hover:bg-gray-700">
                <td className="p-4">{patient.mr_number}</td>
                <td className="p-4">{patient.name}</td>
                <td className="p-4">{patient.father_name}</td>
                <td className="p-4">{patient.gender}</td>
                <td className="p-4">{patient.age}</td>
                <td className="p-4">{patient.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mt-6 bg-gray-600 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 w-full"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

export default PatientDetails;
