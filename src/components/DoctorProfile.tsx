import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  departmentId: string;
}

interface Department {
  id: string;
  name: string;
}

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorAndDepartment = async () => {
      if (!id) return;
      
      try {
        const doctorDoc = await getDoc(doc(db, 'doctors', id));
        if (doctorDoc.exists()) {
          const doctorData = { id: doctorDoc.id, ...doctorDoc.data() } as Doctor;
          setDoctor(doctorData);
          
          // Fetch department
          const departmentDoc = await getDoc(doc(db, 'departments', doctorData.departmentId));
          if (departmentDoc.exists()) {
            setDepartment({ id: departmentDoc.id, name: departmentDoc.data().name });
          }
        } else {
          console.log('No such doctor!');
        }
      } catch (error) {
        console.error("Error fetching doctor: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndDepartment();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="doctor-profile p-4">
      <Link to="/doctors" className="text-blue-500 hover:underline mb-4 block">&larr; Back to Doctors</Link>
      <h1 className="text-2xl font-bold mb-4">Doctor Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Name:</strong>
          {doctor.firstName} {doctor.lastName}
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Contact Number:</strong>
          {doctor.contactNumber}
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Department:</strong>
          {department ? department.name : 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;