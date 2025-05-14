# React + TypeScript + Vite Project

This project is a full-stack application built with **React**, **TypeScript**, and **Vite** on the frontend, and **Node.js** with **Express** on the backend. The application demonstrates a customer management system with features to add, update, delete, and fetch customer data.

---

## Project Structure

The project is divided into two main parts:

### 1. **Frontend**

The frontend is built using **React**, **TypeScript**, and **Vite**. It handles the user interface and communicates with the backend API to fetch and manipulate customer data.

#### **Frontend Directory Structure**

```
frontend/
├── src/
│   ├── components/
│   │   ├── CustomerList.tsx
│   │   ├── AddCustomerWindow.tsx
│   ├── App.tsx
│   ├── api/
│   │   ├── customerApi.ts
│   ├── App.css
│   ├── main.tsx
```

#### **Frontend Features**

- **Customer List**: Displays a list of customers with options to edit or delete.
- **Add Customer Modal**: A modal window to add new customers.
- **API Integration**: Uses `axios` to interact with the backend API for CRUD operations.
- **State Management**: Manages application state using React's `useState` and `useEffect` hooks.

---

### 2. **Backend**

The backend is built using **Node.js**, **Express**, and **MySQL**. It provides RESTful APIs for managing customer data.

#### **Backend Directory Structure**

```
backend/
├── index.ts
├── db.ts

```

#### **Backend Features**

- **Database**: Uses MySQL for storing customer data.
- **API Endpoints**:
  - `GET /api/customers`: Fetch all customers.
  - `POST /api/customers`: Add a new customer.
  - `PUT /api/customers/:id`: Update an existing customer.
  - `DELETE /api/customers/:id`: Delete a customer.
- **Error Handling**: Handles errors gracefully and returns appropriate HTTP status codes.
- **Environment Variables**: Uses `dotenv` to manage sensitive configuration like database credentials.

---

## Deployment

### Frontend

The frontend is deployed to **GitHub Pages** using **GitHub Actions**. The deployment is triggered automatically whenever changes are pushed to the `main` branch.

#### Steps:

1. Ensure the `frontend/vite.config.ts` file has the correct `base` path for GitHub Pages:
   ```ts
   export default defineConfig({
     plugins: [react()],
     base: '/kurve-task/', // Replace with your repository name
   });
   ```
2. The GitHub Actions workflow is defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It builds the frontend and deploys it to the `gh-pages` branch.

---

### Backend

The backend is deployed to **Render** as a web service.

#### Steps:

1. Connect the repository to Render.
2. Create a new **Web Service** in Render.
3. Use the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the environment variables from `backend/.env` to the Render service.

---

### Database

The database uses **Render PostgreSQL** (Free Tier).

#### Steps:

1. Create a new **PostgreSQL Database** in Render.
2. Copy the database credentials and update the `backend/.env` file with the following:
   ```properties
   DB_HOST=<your-database-host>
   DB_PORT=5432
   DB_USER=<your-database-user>
   DB_PASSWORD=<your-database-password>
   DB_NAME=<your-database-name>
   ```
3. Add these environment variables to the Render backend service.

## How It Works

1. **Frontend**:

   - The user interacts with the React UI.
   - Actions like adding, updating, or deleting customers trigger API calls to the backend.

2. **Backend**:

   - The backend receives API requests from the frontend.
   - It interacts with the MySQL database to perform CRUD operations.
   - Returns the results to the frontend in JSON format.

3. **Database**:
   - Stores customer data with fields like `id`, `name`, `email`, and `age`.
   - Ensures data integrity with primary keys and constraints.

---

## Getting Started

### Prerequisites

- Node.js (v21)
- MySQL database
- npm

### Setup

#### **Backend**

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies

   ```
   npm install
   ```

3. Create a `.env` file for environment variables:
   ```properties
   DB_HOST=<your-database-host>
   DB_PORT=5432
   DB_USER=<your-database-user>
   DB_PASSWORD=<your-database-password>
   DB_NAME=<your-database-name>
   ```
4. Start the backend server:
   ```
   npm run dev
   ```

#### **Frontend**

1. Navigate to the `frontend` directory
   ```
   cd frontend
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file for enviornment variables(same level with vite.config.ts):

   ```
   VITE_BACKEND_DOMAIN=http://localhost:3000
   ```

4. Start the fronend development server
   ```
   npm run dev
   ```
