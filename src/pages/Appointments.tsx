import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs, query, where, Query, DocumentData, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

const localizer = momentLocalizer(moment);

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  doctorId: string;
  patientId: string;
}

interface Doctor {
  id: string;
  name: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    const doctorsCollection = collection(db, 'doctors');
    const doctorsSnapshot = await getDocs(doctorsCollection);
    const doctorsList = doctorsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: `${doc.data().firstName} ${doc.data().lastName}`,
    }));
    setDoctors(doctorsList);
  };

  const fetchAppointments = async () => {
    const appointmentsCollection = collection(db, 'appointments');
    let appointmentsQuery: Query<DocumentData>;
    
    if (selectedDoctor) {
      appointmentsQuery = query(appointmentsCollection, where('doctorId', '==', selectedDoctor));
    } else {
      appointmentsQuery = query(appointmentsCollection);
    }

    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    const appointmentsList = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      const start = data.appointmentDate instanceof Timestamp 
        ? data.appointmentDate.toDate() 
        : new Date(data.appointmentDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // Assume 1 hour duration
      
      return {
        id: doc.id,
        title: `Appointment with Dr. ${doctors.find(d => d.id === data.doctorId)?.name || 'Unknown'}`,
        start,
        end,
        doctorId: data.doctorId,
        patientId: data.patientId,
      };
    });
    
    setAppointments(appointmentsList);
  };

  const handleDoctorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDoctor(event.target.value);
  };

  return (
    <div className="appointments p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2">
          <label htmlFor="doctor-select" className="block mb-2">Filter by Doctor:</label>
          <select
            id="doctor-select"
            value={selectedDoctor}
            onChange={handleDoctorChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
        </div>
        <Link to="/add-appointment" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Appointment
        </Link>
      </div>

      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'week', 'day']}
      />
    </div>
  );
};

export default Appointments;