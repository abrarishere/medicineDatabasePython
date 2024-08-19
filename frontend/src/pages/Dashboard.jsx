import { useState } from 'react';
import { FaMedkit, FaWarehouse, FaUser, FaUserInjured, FaHome } from 'react-icons/fa';
import Medicines from '../components/Dashboard/Medicines/Medicines';
import Wards from '../components/Dashboard/Wards/Wards';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [selectedNav, setSelectedNav] = useState('home');

  const navItems = [
    { id: 'home', icon: FaHome },
    { id: 'medicines', icon: FaMedkit },
    { id: 'warehouse', icon: FaWarehouse },
    { id: 'user', icon: FaUser },
    { id: 'patients', icon: FaUserInjured }
  ];

  const renderContent = () => {
    switch (selectedNav) {
      case 'medicines':
        return <Medicines />;
      case 'warehouse':
        return <Wards />;
      default:
        return <div className="text-xl">Welcome to the Dashboard</div>;
    }
  };

  return (
    <div className="container w-full min-h-screen flex flex-col items-center bg-[#141414] text-white">
      <ToastContainer />
      <nav className="flex w-full bg-[#161616] justify-evenly items-center py-2">
        {navItems.map(({ id, icon: Icon }) => (
          <div
            key={id}
            className={`text-4xl p-2 cursor-pointer rounded-full transition-all duration-200
              ${selectedNav === id ? 'bg-[#1e1e1e] text-[#61dafb]' : 'hover:bg-[#121212]'}`}
            onClick={() => setSelectedNav(id)}
          >
            <Icon />
          </div>
        ))}
      </nav>
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
