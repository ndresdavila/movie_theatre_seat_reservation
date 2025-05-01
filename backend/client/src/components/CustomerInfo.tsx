import React from 'react';
import { Customer } from '../types/Customer';

interface CustomerInfoProps {
  customer: Customer;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-medium">Información del Cliente</h3>
      <p>Nombre: {customer.name} {customer.lastname}</p>
      <p>Edad: {customer.age}</p>
      <p>Email: {customer.email || 'No proporcionado'}</p>
      <p>Teléfono: {customer.phoneNumber || 'No proporcionado'}</p>
    </div>
  );
};

export default CustomerInfo;
