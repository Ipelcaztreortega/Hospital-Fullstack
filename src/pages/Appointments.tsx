import React, { useState, useEffect } from 'react';

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const mockAppointments: Appointment[] = [
      { id: 1, patientName: 'John Doe', doctorName: 'Dr. Sarah Lee', date: '2023-09-01', time: '10:00 AM' },
      { id: 2, patientName: 'Jane Smith', doctorName: 'Dr. Michael Chen', date: '2023-09-02', time: '2:30 PM' },
      { id: 3, patientName: 'Bob Johnson', doctorName: 'Dr. Emily Brown', date: '2023-09-03', time: '11:15 AM' },
    ];
    setAppointments(mockAppointments);
  }, []);

  return (
    <div className="appointments">
      <h1>Appointments</h1>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.patientName}</td>
              <td>{appointment.doctorName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;