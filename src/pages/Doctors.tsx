import React, { useState, useEffect } from 'react';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const mockDoctors: Doctor[] = [
      { id: 1, name: 'Dr. Sarah Lee', specialization: 'Cardiology' },
      { id: 2, name: 'Dr. Michael Chen', specialization: 'Pediatrics' },
      { id: 3, name: 'Dr. Emily Brown', specialization: 'Neurology' },
    ];
    setDoctors(mockDoctors);
  }, []);

  return (
    <div className="doctors">
      <h1>Doctors</h1>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>{doctor.name} - Specialization: {doctor.specialization}</li>
        ))}
      </ul>
    </div>
  );
};

export default Doctors;