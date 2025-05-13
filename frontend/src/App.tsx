import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import {
  addCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomers,
} from './apis/customerApi';
import CustomerList from './components/CustomerList';
import AddCustomerWindow from './components/AddCustomerWindow';

//FIXME: init loading twice
function App() {
  const [loading, setLoading] = useState(false); // loading state
  const [hasMore, setHasMore] = useState(true); // has more data
  const [showWAddCustomerWindow, setShowAddCustomerWindow] = useState(false);
  const [customerData, setCustomerData] = useState<
    { id: number; name: string; email: string; age: number }[]
  >([]);

  const fetchCustomers = useCallback(async () => {
    if (loading || !hasMore) {
      console.log('Fetch skipped: loading or no more data');
      return;
    }
    setLoading(true);
    try {
      const limit = 10;
      const offset = customerData.length;
      const customers = await getCustomers(limit, offset);
      console.log(
        'Fetched:',
        customers.map((c: { id: number }) => c.id)
      );
      console.log('Offset used:', offset);
      console.log('customers', customers);
      if (customers.length < limit) {
        setHasMore(false);
      }

      setCustomerData((prev) => [...prev, ...customers]);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, customerData.length]);

  // Initial fetch
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchCustomers().then(() => {
        console.log('Initial fetch completed');
        hasFetched.current = true;
      });
    }
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
      {loading && <div>Loading More...</div>}
      {!loading && hasMore && customerData.length > 0 && (
        <button className="load-more-btn" onClick={fetchCustomers}>
          Load More
        </button>
      )}
      {!hasMore && customerData.length > 0 && <div>No more customers</div>}
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

// TODO: deployment
