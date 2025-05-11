import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

// const initCustomers = [
//   { id: 1, name: 'John Doe', email: 'john@test.com', age: 30 },
//   { id: 2, name: 'Jane Smith', email: 'jane@test.com', age: 25 },
//   { id: 3, name: 'Bob Johnson', email: 'bob@test.com', age: 40 },
//   { id: 4, name: 'Alice Brown', email: 'alice@test.com', age: 35 },
//   { id: 5, name: 'Charlie Davis', email: 'chr@test.com', age: 28 },
//   { id: 6, name: 'Eve Wilson', email: 'eve@test.com', age: 32 },
//   { id: 7, name: 'David Lee', email: 'david@test.com', age: 29 },
//   { id: 8, name: 'Grace Kim', email: 'grace@test.com', age: 27 },
// ];

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
  // const [customers, setCustomers] = useState(initCustomers);
  const [customerData, setData] = useState<
    { id: number; name: string; email: string; age: number }[]
  >([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/customers')
      .then((res) => {
        console.log('res', res);
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const deleteCustomer = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/customers/${id}`
      );
      console.log('res', res);
      setData(customerData.filter((customer) => customer.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
    // setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const updateCustomer = async (
    id: number,
    data: { name: string; email: string; age: number }
  ) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/customers/${id}`,
        data
      );
      // console.log('res', res);
      const index = customerData.findIndex((customer) => customer.id === id);
      if (index !== -1) {
        const updatedCustomers = [...customerData];
        updatedCustomers[index] = {
          ...updatedCustomers[index],
          ...data,
        };
        setData(updatedCustomers);
      }
    } catch (err) {
      console.error('Error updating customer:', err);
    }
  };

  const addCustomer = async (newCustomer: {
    name: string;
    email: string;
    age: number;
  }) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/customers',
        newCustomer
      );
      console.log('res', res);
      setData([
        ...customerData,
        { id: customerData.length + 1, ...newCustomer },
      ]);
    } catch (err) {
      console.error('Error adding customer:', err);
    }
  };

  return (
    <div className="App">
      <h1>Customer List</h1>
      <div className="customer-list">
        {customerData.length > 0 ? (
          customerData.map((customer, index) => {
            return (
              <CustomerList
                key={`${customer.id}-${index}`}
                id={customer.id}
                name={customer.name}
                email={customer.email}
                age={customer.age}
                onDelete={deleteCustomer}
                onUpdate={updateCustomer}
              />
            );
          })
        ) : (
          <div className="no-data">
            <h2>Loading customers</h2>
          </div>
        )}
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
