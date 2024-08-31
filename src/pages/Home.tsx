import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="home">
      <h1>Welcome to Our Hospital Management System</h1>
      <p>This system helps manage patients, doctors, and appointments efficiently.</p>
      <div className="quick-links">
        <h2>Quick Links</h2>
        <ul>
          <li>View Patients</li>
          <li>View Doctors</li>
          <li>Manage Appointments</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;