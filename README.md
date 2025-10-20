# Student Management API

This project is a **Node.js + MySQL REST API** for managing teachers, students, and notifications. It implements the following features:

- Register students to teachers
- Retrieve common students of multiple teachers
- Suspend a student
- Retrieve students eligible to receive a notification

Unit tests are included using **Jest**.
API documentation available via **Swagger**.

---

## Technology Stack

- **Backend:** Node.js (Express, TypeScript)
- **Database:** MySQL
- **ORM:** Sequelize
- **Testing:** Jest
- **Containerization:** Docker, Docker Compose
- **Documentation:** Swagger (via swagger-ui-express)

---

## API Documentation (Swagger)

You can view and test all API endpoints directly in **Swagger UI** for the deployed application:

**[https://administrative-app.onrender.com/api-docs/](https://administrative-app.onrender.com/api-docs/)**

This documentation allows you to:

- **Explore all endpoints interactively**
- **Review request/response formats and status codes**
- **Send test requests directly from your browser**

_No setup is required — simply open the link above to try the live API!_

---

### Postman Collection

To conveniently test the API in both local and production, the project includes a **Postman collection** file named `student management api.postman_collection.json`.

You can use this file to:

- Quickly import all the API endpoints into Postman.
- Switch between local and deployment environments for testing purposes.

### How to Use the Postman Collection:

1. Open Postman.
2. Click on **Import** and select the `student management api.postman_collection.json` file from the project directory.
3. The included environment variables for **local** environments will automatically be imported.
4. Start testing the endpoints with the pre-configured requests!

## Prerequisites

Make sure you have installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (optional, if you want to run locally without Docker)

---

## Running Locally with Docker

1. **Clone this repository**:

```bash
git clone https://github.com/omelandah/interview-assignment.git
cd interview-assignment
```

2. **Configure Environment Variables**:

   You need to ensure the environment variables are properly configured for your application to run. The environment variables can be set in the `docker-compose.yml` file under the `app` service. Here's the relevant section:

   ```yaml
   environment:
     - NODE_ENV=development
     - DB_HOST=db
     - DB_USER=root
     - DB_PASSWORD=my_password
     - DB_NAME=my_database
     - DB_PORT=3306
   ```

   These environment variables do the following:
   - **NODE_ENV**: Specifies the environment mode, which is set to development.
   - **DB_HOST**: Points to the database service named `db` (this matches the service name in Docker Compose).
   - **DB_USER**: Username for the database, in this case, set to `root`.
   - **DB_PASSWORD**: Password for the database (change `my_password` to your actual password if needed).
   - **DB_NAME**: Name of the MySQL database being used, set to `my_database`.
   - **DB_PORT**: Port where the database is exposed, typically `3306` for MySQL.

   If you need to customize these values, modify them in the `docker-compose.yml` file accordingly.

3. **Build and Start the Containers**:

   Run the following command to build and start the containers:

   ```bash
   docker-compose up --build -d
   ```

   This command start:
   - MySQL on port 3306
   - Node.js API on port 3000

4. **Access the Application**:

   The API should now be reachable at:

   ```
   http://localhost:3000/api
   ```

5. **Database Setup**:
   - Run migrations to create the database schema with this command:

   ```bash
   docker-compose exec app npm run migrate
   ```

   - (Optional) Seed the database with initial data:

   ```bash
   docker-compose exec app npm run seed
   ```

6. **Unit Testing**:

   To execute the unit tests and generate a coverage report, run the following command:

   ```bash
   docker-compose exec app npm run test
   ```

   This command will:
   - Run all unit tests in the project.
   - Display the results of each test case.
   - Provide a detailed coverage report, showing which parts of the code are covered by tests.
