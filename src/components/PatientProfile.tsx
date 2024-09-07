import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  address: string;
}

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        const patientDoc = await getDoc(doc(db, 'patients', id));
        if (patientDoc.exists()) {
          setPatient({ id: patientDoc.id, ...patientDoc.data() } as Patient);
        } else {
          console.log('No such patient!');
        }
      } catch (error) {
        console.error("Error fetching patient: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="patient-profile p-4">
      <Link to="/patients" className="text-blue-500 hover:underline mb-4 block">&larr; Back to Patients</Link>
      <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Name:</strong>
          {patient.firstName} {patient.lastName}
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Date of Birth:</strong>
          {patient.dateOfBirth}
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Gender:</strong>
          {patient.gender}
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Contact Number:</strong>
          {patient.contactNumber}
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Address:</strong>
          {patient.address}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;