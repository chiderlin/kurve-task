import express, { Request, Response } from 'express';
import {
  connectToDB,
  insertCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
  getCustomerById,
  insertBulkCustomers,
} from './db';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.urlencoded({ extended: true }));
const db = connectToDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/customers', async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    console.log('limit', limit);
    console.log('offset', offset);
    const customers = await getCustomers(
      db,
      parseInt(limit as string),
      parseInt(offset as string)
    );
    res.status(200).json(customers);
    return;
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

app.get('/api/customers/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const _id = parseInt(id);
  if (isNaN(_id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const customer = await getCustomerById(db, _id);
    res.status(200).json(customer);
    return;
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

app.post('/api/customers', async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    if (!name || !email || !age) {
      res.status(400).json({ error: 'Name, email, and age are required' });
      return;
    }
    const { id: customerId } = await insertCustomer(db, req.body);
    // console.log('rs', customerId);
    const customer = await getCustomerById(db, customerId);
    res.status(201).json({
      message: 'Customer added successfully',
      data: customer,
    });
    return;
  } catch (error) {
    console.error('Error inserting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

app.put('/api/customers/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email, age } = req.body;
  if (!name || !email || !age || !id) {
    res.status(400).json({ error: 'Name, email, and age are required' });
    return;
  }
  const _id = parseInt(id);
  if (isNaN(_id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  try {
    const rs = await updateCustomer(db, _id, { name, email, age });
    console.log('rs', rs);
    res.status(200).json({
      message: 'Customer updated successfully',
    });
    return;
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

app.delete('/api/customers/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const _id = parseInt(id);
  if (isNaN(_id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const rs = await deleteCustomer(db, _id);
    console.log('rs', rs);
    res.status(200).json({
      message: 'Customer deleted successfully',
    });
    return;
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// for testing bulk insert
// app.post('/api/customers/bulk', async (req: Request, res: Response) => {
//   try {
//     const customers = Array.from({ length: 1000 }, (_, i) => ({
//       name: `Customer ${i}`,
//       email: `customer${i + 1}@example.com`,
//       age: Math.floor(Math.random() * 60) + 20,
//     }));

//     await insertBulkCustomers(db, customers);
//     res.status(201).json({
//       message: 'Customers added successfully',
//     });
//     return;
//   } catch (error) {
//     console.error('Error inserting customers:', error);
//     res.status(500).json({ error: 'Internal server error' });
//     return;
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
