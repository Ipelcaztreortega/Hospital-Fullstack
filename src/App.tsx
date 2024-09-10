import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';  // Import the Navbar component
import Home from './pages/Home';
import Patients from './pages/Patients';
import PatientProfile from './components/PatientProfile';
import Doctors from './pages/Doctors';
import DoctorProfile from './components/DoctorProfile';
import Appointments from './pages/Appointments';
import AddAppointment from './components/AddAppointment';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />  {/* Use the Navbar component here */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patient/:id" element={<PatientProfile />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/add-appointment" element={<AddAppointment />} />
          </Routes>
        </main>
        <footer className="bg-gray-200 text-center py-4">
          <p>© 2024 IE Group. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;