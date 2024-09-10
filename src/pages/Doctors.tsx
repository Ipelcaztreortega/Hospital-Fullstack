import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

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

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDoctor, setNewDoctor] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    departmentId: ''
  });
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isAddingNewDepartment, setIsAddingNewDepartment] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    const doctorsQuery = query(collection(db, "doctors"), orderBy("lastName"));
    const querySnapshot = await getDocs(doctorsQuery);
    const doctorList: Doctor[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Doctor));
    setDoctors(doctorList);
  };

  const fetchDepartments = async () => {
    const departmentsQuery = query(collection(db, "departments"), orderBy("name"));
    const querySnapshot = await getDocs(departmentsQuery);
    const departmentList: Department[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    setDepartments(departmentList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'departmentId' && value === 'new') {
      setIsAddingNewDepartment(true);
    } else {
      setNewDoctor(prev => ({ ...prev, [name]: value }));
      if (name === 'departmentId') {
        setIsAddingNewDepartment(false);
      }
    }
  };

  const handleNewDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDepartmentName(e.target.value);
  };

  const handleAddNewDepartment = async () => {
    if (newDepartmentName.trim() === '') return;

    try {
      const docRef = await addDoc(collection(db, "departments"), { name: newDepartmentName });
      const newDepartment = { id: docRef.id, name: newDepartmentName };
      setDepartments([...departments, newDepartment]);
      setNewDoctor(prev => ({ ...prev, departmentId: docRef.id }));
      setNewDepartmentName('');
      setIsAddingNewDepartment(false);
    } catch (error) {
      console.error("Error adding new department: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "doctors"), newDoctor);
      setNewDoctor({
        firstName: '',
        lastName: '',
        contactNumber: '',
        departmentId: ''
      });
      fetchDoctors();
    } catch (error) {
      console.error("Error adding doctor: ", error);
    }
  };

  return (
    <div className="doctors p-4">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            name="firstName"
            value={newDoctor.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="lastName"
            value={newDoctor.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="tel"
            name="contactNumber"
            value={newDoctor.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <select
            name="departmentId"
            value={newDoctor.departmentId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
            <option value="new">+ Add New Department</option>
          </select>
        </div>
        {isAddingNewDepartment && (
          <div className="mb-4">
            <input
              type="text"
              value={newDepartmentName}
              onChange={handleNewDepartmentChange}
              placeholder="New Department Name"
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={handleAddNewDepartment}
              className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Department
            </button>
          </div>
        )}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Doctor</button>
      </form>
      
      <h2 className="text-xl font-semibold mb-2">Doctor List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <Link to={`/doctor/${doctor.id}`} key={doctor.id} className="block">
            <div className="border p-4 rounded hover:bg-gray-100 transition-colors duration-200">
              <strong>{doctor.firstName} {doctor.lastName}</strong><br />
              Contact: {doctor.contactNumber}<br />
              Department: {departments.find(dept => dept.id === doctor.departmentId)?.name || 'Unknown'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Doctors;