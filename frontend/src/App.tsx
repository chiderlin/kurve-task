import { useState } from 'react';
import './App.css';

const initCustomers = [
  { id: 1, name: 'John Doe', email: 'john@test.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@test.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@test.com', age: 40 },
  { id: 4, name: 'Alice Brown', email: 'alice@test.com', age: 35 },
  { id: 5, name: 'Charlie Davis', email: 'chr@test.com', age: 28 },
  { id: 6, name: 'Eve Wilson', email: 'eve@test.com', age: 32 },
  { id: 7, name: 'David Lee', email: 'david@test.com', age: 29 },
  { id: 8, name: 'Grace Kim', email: 'grace@test.com', age: 27 },
];

function CustomerList({
  id,
  name,
  email,
  age,
  onDelete,
  onUpdate,
}: {
  id: number;
  name: string;
  email: string;
  age: number;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    data: { name: string; email: string; age: number }
  ) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);
  const [editedAge, setEditedAge] = useState(age);

  const handleSave = () => {
    onUpdate(id, { name: editedName, email: editedEmail, age: editedAge });
    setIsEditing(false);
  };

  return (
    <div className="customer">
      <div className="customer-top-bar">
        {isEditing ? (
          <button type="button" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button type="button" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
      <div>
        {isEditing ? (
          <>
            <input
              className="customer-edit-name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <input
              className="customer-edit-name"
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
            <input
              className="customer-edit-name"
              type="number"
              value={editedAge}
              onChange={(e) => setEditedAge(parseInt(e.target.value))}
            />
          </>
        ) : (
          <>
            <h3>{editedName}</h3>
            <p>{editedEmail}</p>
            <p>{editedAge}</p>
          </>
        )}
      </div>
    </div>
  );
}

function AddCustomerWindow({
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

function App() {
  const [showWAddCustomerWindow, setShowAddCustomerWindow] = useState(false);
  const [customers, setCustomers] = useState(initCustomers);
  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const updateCustomer = (
    id: number,
    data: { name: string; email: string; age: number }
  ) => {
    const index = customers.findIndex((customer) => customer.id === id);
    if (index !== -1) {
      const updatedCustomers = [...customers];
      updatedCustomers[index] = {
        ...updatedCustomers[index],
        ...data,
      };
      setCustomers(updatedCustomers);
    }
  };

  const addCustomer = (newCustomer: {
    name: string;
    email: string;
    age: number;
  }) => {
    setCustomers([
      ...customers,
      {
        id: customers.length + 1,
        ...newCustomer,
      },
    ]);
  };

  return (
    <div className="App">
      <h1>Customer List</h1>
      <div className="customer-list">
        {customers.map((customer) => {
          return (
            <CustomerList
              key={customer.id}
              id={customer.id}
              name={customer.name}
              email={customer.email}
              age={customer.age}
              onDelete={deleteCustomer}
              onUpdate={updateCustomer}
            />
          );
        })}
      </div>
      <button
        className="add-customer-btn"
        onClick={() => setShowAddCustomerWindow(true)}
      >
        +
      </button>
      {showWAddCustomerWindow && (
        <AddCustomerWindow
          onClose={() => setShowAddCustomerWindow(false)}
          onAddCustomer={addCustomer}
        />
      )}
    </div>
  );
}

export default App;
