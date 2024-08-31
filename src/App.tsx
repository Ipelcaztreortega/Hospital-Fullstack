import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Import your page components here
import Home from './pages/Home.tsx';
import Patients from './pages/Patients.tsx';
import Doctors from './pages/Doctors.tsx';
import Appointments from './pages/Appointments.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/patients">Patients</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;