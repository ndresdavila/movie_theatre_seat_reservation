// src/types/Customer.ts

export interface CreateCustomerDto {
    documentNumber: string;
    firstName: string;
    lastName: string;
    age: number;
    email?: string;
    phoneNumber?: string;
  }
  
  // Este tipo representa un cliente completo que viene del backend
  export interface Customer {
    id: number;
    documentNumber: string;
    name: string;
    lastname: string;
    age: number;
    email?: string;
    phoneNumber?: string;
  }
  