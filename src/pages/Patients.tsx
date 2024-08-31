import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Patient {
  id: string;
  name: string;
  age: number;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const patientList: Patient[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Patient));
      setPatients(patientList);
    };

    fetchPatients();
  }, []);

  return (
    <div className="patients">
      <h1>Patients</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name} - Age: {patient.age}</li>
        ))}
      </ul>
    </div>
  );
};

export default Patients;