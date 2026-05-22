# DocAppoint Server

Backend REST API for the DocAppoint doctor appointment booking system. Built with Node.js, Express, and MongoDB Atlas.

## Live Server
[https://docappointment-server-gules.vercel.app(https://docappointment-server-gules.vercel.app)]

Update `CLIENT_URL` in your environment to point to the deployed frontend URL.


## Features

- **Doctor Listings** — Get all doctors, top-rated doctors, single doctor details, and search by name
- **Appointment Booking** — Create, read, update, and delete user appointment bookings
- **MongoDB Integration** — All data persisted in MongoDB Atlas
- **CORS Configuration** — Origin controlled via environment variable for secure cross-origin requests

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server health check |
| GET | `/api/doctors/all` | Get all doctors |
| GET | `/api/doctors/top` | Get top 3 rated doctors |
| GET | `/api/doctors/search?name=` | Search doctors by name |
| GET | `/api/doctors/:id` | Get single doctor by ID |
| POST | `/api/user/appointment/create` | Book a new appointment |
| GET | `/api/user/appointment/all` | Get all appointments |
| GET | `/api/user/appointment?email=` | Get appointments by user email |
| PUT | `/api/user/appointment/:id` | Update an appointment |
| DELETE | `/api/user/appointment/:id` | Delete an appointment |

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB Atlas
- **Other:** CORS, dotenv, nodemon

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm start
```

## Environment Variables

```env
PORT=
DB_URL=
CLIENT_URL=
```
