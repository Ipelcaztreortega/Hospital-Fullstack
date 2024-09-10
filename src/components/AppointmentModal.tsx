import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  doctorId: string;
  patientId: string;
}

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ appointment, onClose }) => {
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const fetchDoctorAndPatient = async () => {
      const doctorDoc = await getDoc(doc(db, 'doctors', appointment.doctorId));
      const patientDoc = await getDoc(doc(db, 'patients', appointment.patientId));

      if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data();
        setDoctorName(`${doctorData.firstName} ${doctorData.lastName}`);
      }

      if (patientDoc.exists()) {
        const patientData = patientDoc.data();
        setPatientName(`${patientData.firstName} ${patientData.lastName}`);
      }
    };

    fetchDoctorAndPatient();
  }, [appointment]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Appointment Details</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Doctor: {doctorName}
            </p>
            <p className="text-sm text-gray-500">
              Patient: {patientName}
            </p>
            <p className="text-sm text-gray-500">
              Date: {appointment.start.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Time: {appointment.start.toLocaleTimeString()} - {appointment.end.toLocaleTimeString()}
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;