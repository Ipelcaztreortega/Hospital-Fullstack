import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

const AddAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'Scheduled'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    const doctorsCollection = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsCollection);
    const doctorsList = doctorsSnapshot.docs.map(doc => ({
      id: doc.id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
    }));
    console.log('Fetched doctors:', doctorsList);
    setDoctors(doctorsList);
  };

  const fetchPatients = async () => {
    const patientsCollection = collection(db, 'patients');
    const patientsSnapshot = await getDocs(patientsCollection);
    const patientsList = patientsSnapshot.docs.map(doc => ({
      id: doc.id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
    }));
    console.log('Fetched patients:', patientsList);
    setPatients(patientsList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const appointmentsCollection = collection(db, 'appointments');
      await addDoc(appointmentsCollection, {
        ...appointmentData,
        createdAt: new Date()
      });
      navigate('/appointments');
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };

  return (
    <div className="add-appointment p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientId" className="block mb-2">Patient:</label>
          <select
            id="patientId"
            name="patientId"
            value={appointmentData.patientId}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="doctorId" className="block mb-2">Doctor:</label>
          <select
            id="doctorId"
            name="doctorId"
            value={appointmentData.doctorId}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="appointmentDate" className="block mb-2">Appointment Date:</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={appointmentData.appointmentDate}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="appointmentTime" className="block mb-2">Appointment Time:</label>
          <input
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            value={appointmentData.appointmentTime}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-2">Status:</label>
          <select
            id="status"
            name="status"
            value={appointmentData.status}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Appointment
        </button>
      </form>
    </div>
  );
};

export default AddAppointment;