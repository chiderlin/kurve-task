import axios from 'axios';
const DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;

export const getCustomers = async (limit: number, offset: number) => {
  try {
    // console.log('limit', limit);
    // console.log('offset', offset);
    const res = await axios.get(
      `${DOMAIN}/api/customers?limit=${limit}&offset=${offset}`
    );
    // console.log('res', res);

    return res.data;
  } catch (err) {
    console.error('Error fetching customers:', err);
  }
};

export const deleteCustomer = async (id: number) => {
  try {
    await axios.delete(`${DOMAIN}/api/customers/${id}`);
    // console.log('res', res);
  } catch (err) {
    console.error('Error deleting customer:', err);
  }
};

export const updateCustomer = async (
  id: number,
  data: { name: string; email: string; age: number }
) => {
  try {
    await axios.put(`${DOMAIN}/api/customers/${id}`, data);
    // console.log('res', res);
  } catch (err) {
    console.error('Error updating customer:', err);
  }
};

export const addCustomer = async (newCustomer: {
  name: string;
  email: string;
  age: number;
}) => {
  try {
    const res = await axios.post(`${DOMAIN}/api/customers`, newCustomer);
    console.log('res', res);
    return res.data;
  } catch (err) {
    console.error('Error adding customer:', err);
  }
};
