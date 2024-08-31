// src/types/Patient.ts

export interface Patient {
    id: number;
    name: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    phoneNumber: string;
    emergencyContact: string;
  }