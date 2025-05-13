import { useState } from 'react';

export default function AddCustomerWindow({
  onClose,
  onAddCustomer,
}: {
  onClose: () => void;
  onAddCustomer: (newCustomer: {
    name: string;
    email: string;
    age: number;
  }) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');

  const handleAddCustomer = () => {
    if (name && email && age) {
      onAddCustomer({ name, email, age });
      onClose();
    }
  };

  return (
    <div className="add-customer-window">
      <h2>Add New Customer</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            value={name}
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Age:
          <input
            type="number"
            value={age}
            name="age"
            onChange={(e) =>
              setAge(e.target.value ? parseInt(e.target.value) : '')
            }
          />
        </label>
        <button type="button" onClick={handleAddCustomer}>
          Add Customer
        </button>
        <button id="close-btn" type="button" onClick={onClose}>
          X
        </button>
      </form>
    </div>
  );
}
