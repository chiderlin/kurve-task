import { useState, useEffect } from 'react';
import './App.css';
import {
  addCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomers,
} from './apis/customerApi';
import CustomerList from './components/CustomerList';
import AddCustomerWindow from './components/AddCustomerWindow';

function App() {
  const [showWAddCustomerWindow, setShowAddCustomerWindow] = useState(false);
  const [customerData, setCustomerData] = useState<
    { id: number; name: string; email: string; age: number }[]
  >([]);

  useEffect(() => {
    let isMounted = true;
    getCustomers()
      .then((data) => {
        if (isMounted) {
          // console.log('res', data);
          setCustomerData([...data]);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddCustomer = async (newCustomer: {
    name: string;
    email: string;
    age: number;
  }) => {
    try {
      const addedCustomer = await addCustomer(newCustomer);
      // console.log('addedCustomer', addedCustomer.data);
      setCustomerData([...customerData, addedCustomer.data]);
    } catch (err) {
      console.error('Error adding customer:', err);
    }
  };

  const handleUpdateCustomer = async (
    id: number,
    data: { name: string; email: string; age: number }
  ) => {
    try {
      await updateCustomer(id, data);
      const index = customerData.findIndex((customer) => customer.id === id);
      if (index !== -1) {
        const updatedCustomers = [...customerData];
        updatedCustomers[index] = {
          ...updatedCustomers[index],
          ...data,
        };
        setCustomerData(updatedCustomers);
      }
    } catch (err) {
      console.error('Error updating customer:', err);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    try {
      await deleteCustomer(id);
      setCustomerData(customerData.filter((customer) => customer.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
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
                onDelete={handleDeleteCustomer}
                onUpdate={handleUpdateCustomer}
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
          onAddCustomer={handleAddCustomer}
        />
      )}
    </div>
  );
}

export default App;

// TODO:deploy to Render
// TODO: generate fake data (10,000) -> lazy loading
