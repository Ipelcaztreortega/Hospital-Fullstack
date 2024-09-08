import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../config/firebase";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const authListener = auth.onAuthStateChanged((user) => {
      setIsUserLoggedIn(!!user);
    });

    return () => {
      authListener(); // Unsubscribe from the listener when the component unmounts
    };
  }, []);

  const handleAuthButtonClick = () => {
    if (isUserLoggedIn) {
      // Log out the user
      auth.signOut()
        .then(() => {
          setIsUserLoggedIn(false);
          navigate("/"); // Redirect to home after logout
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    } else {
      // Redirect to the login page
      navigate("/Login");
    }
  };

  const getUserButtonContent = () => {
    return isUserLoggedIn ? "Logout" : "Login";
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">HospitalMS</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Home</Link>
              <Link to="/patients" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Patients</Link>
              <Link to="/doctors" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Doctors</Link>
              <Link to="/appointments" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">Appointments</Link>
              <button onClick={handleAuthButtonClick} className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300">
                {getUserButtonContent()}
              </button>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6 text-gray-500 hover:text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <Link to="/" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Home</Link>
        <Link to="/patients" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Patients</Link>
        <Link to="/doctors" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Doctors</Link>
        <Link to="/appointments" className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">Appointments</Link>
        <button onClick={handleAuthButtonClick} className="block py-2 px-4 text-sm hover:bg-green-500 hover:text-white transition duration-300">
          {getUserButtonContent()}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
