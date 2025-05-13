import mysql, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
let pool: mysql.Pool;

export function connectToDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Connected to the database');
  }

  return pool;
}

export async function insertCustomer(
  pool: mysql.Pool,
  customer: { name: string; email: string; age: number }
): Promise<ResultSetHeader> {
  try {
    const query = `INSERT INTO ${process.env.DB_NAME}.Customers (name, email, age) VALUES (?,?,?)`;
    const [result] = await pool.execute<ResultSetHeader>(query, [
      customer.name,
      customer.email,
      customer.age,
    ]);
    console.log('Inserted customer:', result);
    return result;
  } catch (error) {
    console.error('Error inserting customer:', error);
    throw error;
  }
}

export async function getCustomers(pool: mysql.Pool) {
  try {
    const query = `SELECT * FROM ${process.env.DB_NAME}.Customers`;
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

export async function getCustomerById(pool: mysql.Pool, id: number) {
  try {
    const query = `SELECT * FROM ${process.env.DB_NAME}.Customers WHERE id = ?`;
    const [rows] = await pool.execute<any[]>(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    throw error;
  }
}

export async function updateCustomer(
  pool: mysql.Pool,
  id: number,
  customer: { name: string; email: string; age: number }
) {
  try {
    const query = `UPDATE ${process.env.DB_NAME}.Customers SET name = ?, email = ?, age = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [
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

export async function deleteCustomer(pool: mysql.Pool, id: number) {
  try {
    const query = `DELETE FROM ${process.env.DB_NAME}.Customers WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    console.log('Deleted customer:', result);
    return result;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}
