// import mysql, { ResultSetHeader } from 'mysql2/promise';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
let pool: Pool;

export function connectToDB() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    });
    console.log('Connected to the database');
  }

  return pool;
}

export async function insertBulkCustomers(
  pool: Pool,
  customers: { name: string; email: string; age: number }[]
): Promise<any> {
  try {
    const query = `INSERT INTO customers (name, email, age) 
    VALUES ${customers
      .map(
        (_, index) =>
          `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
      )
      .join(', ')}
    `;
    const values = customers.flatMap((customer) => [
      customer.name,
      customer.email,
      customer.age,
    ]);
    await pool.query(query, values);
    console.log(`Inserted ${customers.length} customers successfully.`);
  } catch (error) {
    console.error('Error inserting customer:', error);
    throw error;
  }
}

export async function insertCustomer(
  pool: Pool,
  customer: { name: string; email: string; age: number }
): Promise<any> {
  try {
    const query = `INSERT INTO customers (name, email, age) VALUES ($1,$2,$3) RETURNING id`;
    const result = await pool.query(query, [
      customer.name,
      customer.email,
      customer.age,
    ]);
    console.log('Inserted customer:', result);
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting customer:', error);
    throw error;
  }
}

export async function getCustomers(pool: Pool, limit: number, offset: number) {
  try {
    const query = `SELECT * FROM customers ORDER BY id LIMIT $1 OFFSET $2`;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

export async function getCustomerById(pool: Pool, id: number) {
  try {
    const query = `SELECT * FROM customers WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    throw error;
  }
}

export async function updateCustomer(
  pool: Pool,
  id: number,
  customer: { name: string; email: string; age: number }
) {
  try {
    const query = `UPDATE customers SET name = $1, email = $2, age = $3 WHERE id = $4`;
    const result = await pool.query(query, [
      customer.name,
      customer.email,
      customer.age,
      id,
    ]);
    console.log('Updated customer:', result);
    return result;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

export async function deleteCustomer(pool: Pool, id: number) {
  try {
    const query = `DELETE FROM customers WHERE id = $1`;
    const result = await pool.query(query, [id]);
    console.log('Deleted customer:', result);
    return result;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}
