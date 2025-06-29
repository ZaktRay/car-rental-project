import React, { useState } from 'react';
import {
  FaChartBar,
  FaCar,
  FaCalendarAlt,
  FaUser,
  FaChartPie,
} from 'react-icons/fa';
import { IoIosSettings } from "react-icons/io";
import { Link,useLocation } from 'react-router-dom';



const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const activeLink = location.pathname.split('/');
  const [activeItem, setActiveItem] = useState(activeLink[2]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar},
    { id: 'cars', label: 'Manage Cars', icon: FaCar},
    { id: 'bookings', label: 'Manage Bookings', icon: FaCalendarAlt},
    { id: 'users', label: 'Manage Users', icon: FaUser},
    { id: 'settings', label: 'Settings', icon: IoIosSettings}
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsOpen(false);
    console.log(activeLink[2])
  };

  return (
    <>
      {/* Menu Button (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors md:hidden"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? "open" : "close"}
      </button>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`top-0 left-0 h-full w-full bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:shadow-none`}
        role="navigation"
        aria-label="Admin Sidebar"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-500">Car Rental Admin</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="overflow-y-auto mt-6 flex-1 h-[100vh]">
          <ul className="space-y-2 px-4">
            {menuItems.map(({ id, label, icon: Icon}) => {
              const isActive = activeItem === id;
              return (
                <li key={id}>
                  <Link to={`/admin/${id}`}>
                  
                  <button
                    onClick={() => handleItemClick(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${isActive
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-500'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                    <span className="font-medium">{label}</span>
                  </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
