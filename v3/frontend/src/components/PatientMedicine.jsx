const PatientMedicine = (patient) => {
  return (
    <div className="bg-[#2f2f2f] p-4 rounded-lg flex flex-col gap-4 text-white break-all whitespace-normal overflow-hidden">
      {JSON.stringify(patient)}
    </div>
  );
};

export default PatientMedicine;
