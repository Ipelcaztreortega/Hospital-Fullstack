import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import AppointmentModal from '../components/AppointmentModal';

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
  firstName: string;
  lastName: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
    }));
    setDoctors(doctorsList);
  };

  const fetchAppointments = async () => {
    const appointmentsCollection = collection(db, 'appointments');
    let appointmentsQuery = query(appointmentsCollection);
    
    if (selectedDoctor) {
      appointmentsQuery = query(appointmentsCollection, where('doctorId', '==', selectedDoctor));
    }

    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    const appointmentsList = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: `Appointment with Dr. ${doctors.find(d => d.id === data.doctorId)?.lastName || 'Unknown'}`,
        start: data.appointmentDate && data.appointmentTime 
          ? new Date(`${data.appointmentDate}T${data.appointmentTime}`)
          : new Date(),
        end: data.appointmentDate && data.appointmentTime 
          ? new Date(new Date(`${data.appointmentDate}T${data.appointmentTime}`).getTime() + 3600000)
          : new Date(new Date().getTime() + 3600000),
        doctorId: data.doctorId,
        patientId: data.patientId,
      };
    });
    
    setAppointments(appointmentsList);
  };

  const handleDoctorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDoctor(event.target.value);
  };

  const handleSelectEvent = (event: Appointment) => {
    setSelectedAppointment(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
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
              <option key={doctor.id} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>
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
        onSelectEvent={handleSelectEvent}
      />

      {isModalOpen && selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Appointments;