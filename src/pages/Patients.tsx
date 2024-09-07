import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  address: string;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const querySnapshot = await getDocs(collection(db, "patients"));
    const patientList: Patient[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Patient));
    setPatients(patientList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "patients"), newPatient);
      setNewPatient({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        address: ''
      });
      fetchPatients();
    } catch (error) {
      console.error("Error adding patient: ", error);
    }
  };

  return (
    <div className="patients p-4">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            name="firstName"
            value={newPatient.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            value={newPatient.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="date"
            name="dateOfBirth"
            value={newPatient.dateOfBirth}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <select
            name="gender"
            value={newPatient.gender}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <input
            type="tel"
            name="contactNumber"
            value={newPatient.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            name="address"
            value={newPatient.address}
            onChange={handleInputChange}
            placeholder="Address"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Patient</button>
      </form>
      
      <h2 className="text-xl font-semibold mb-2">Patient List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <Link to={`/patient/${patient.id}`} key={patient.id} className="block">
            <div className="border p-4 rounded hover:bg-gray-100 transition-colors duration-200">
              <strong>{patient.firstName} {patient.lastName}</strong><br />
              Born: {patient.dateOfBirth}<br />
              Gender: {patient.gender}<br />
              Contact: {patient.contactNumber}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Patients;