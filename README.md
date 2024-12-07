# Homework 2: MongoDB Basics

This pull request introduces the completed second homework project for the Node.js course. The focus of this assignment was connecting a Node.js application to MongoDB, working with data models, and querying the database.

---

## Features Implemented

### MongoDB Connection:
- Implemented connection to MongoDB using `mongoose`.
- Configured connection string dynamically via environment variables in `.env`.

### Contacts Model:
- Created a Mongoose schema and model to represent contacts in the database.
  - Fields include `name`, `email`, `phoneNumber`, `isFavourite`, `contactType`, and timestamps.

### Express API:
- Developed endpoints for working with contacts:
  - `GET /contacts`: Retrieve all contacts from the database.
  - `GET /contacts/:contactId`: Retrieve a specific contact by its ID.
- Proper error handling and validation implemented for:
  - `404 Not Found`: Triggered if no contacts are found or the ID does not exist.
  - `500 Internal Server Error`: Handles unexpected issues.

### Middleware:
- Integrated `cors` for cross-origin requests.
- Added `pino-http` for structured logging.
- Utilized Express JSON middleware for parsing request bodies.

---

## Project Structure

### Folders:
- **`src/`**
  - `db/`: Contains MongoDB connection setup and models.
  - `services/`: Contains reusable logic for database queries.
  - `utils/`: Utilities for reading environment variables.
  - `controllers/`, `middlewares/`: Placeholder directories for future scalability.
  
- **`.env.example`**: Provides a template for environment variables.

---

This submission completes Homework 2, providing a robust foundation for integrating MongoDB into Node.js applications.





