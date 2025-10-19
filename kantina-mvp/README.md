# Kantina MVP

The **Kantina MVP** is a turn‑key MERN stack starter designed to bootstrap a food‑ordering platform.  It includes a React + Vite frontend with TailwindCSS and Firebase Authentication, along with a Node.js + Express backend that is ready to integrate with MongoDB in the future.  The project is structured so that it can be opened and run directly in Visual Studio Code on Windows or any other platform.

## Features

* **Frontend** – A React application scaffolded with Vite.  It includes pages for user registration and login using Firebase email/password authentication, a protected dashboard page, and a services module for configuring Firebase.  TailwindCSS provides a responsive, mobile‑first layout.  Environment variables for your Firebase project are loaded from `.env.local` to avoid hardcoding sensitive keys.
* **Backend** – A minimal Express server listening on port `5000`.  It exposes a `/api/health` endpoint that returns a simple JSON status.  A placeholder MongoDB connection is set up in `config/db.js` so you can easily enable database connectivity later.
* **Monorepo scripts** – The root `package.json` uses the `concurrently` package to run both the client and server with a single `npm run dev` command.  There are also helper scripts to install dependencies in both subprojects.

## Getting Started

1. **Install dependencies** – From the project root run:

   ```bash
   npm run install:all
   ```

   This installs dependencies for both the client and the server.

2. **Configure environment variables** – Copy the example values in `client/.env.local` and `server/.env` to your own `.env.local` and `.env` files.  Replace `REPLACE_ME` and placeholder values with the Firebase credentials for your project and the MongoDB connection string when you are ready to add a database.

3. **Start the development servers** – From the project root run:

   ```bash
   npm run dev
   ```

   Vite will serve the React client at <http://localhost:5173> and the Express API will be available at <http://localhost:5000/api/health>.

## Folder Structure

```
kantina-mvp/
├── client/               # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable UI pieces (e.g. ProtectedRoute)
│   │   ├── pages/        # Login, Register, Dashboard
│   │   ├── services/     # Firebase configuration
│   │   └── utils/        # Placeholder for helpers
│   ├── .env.local        # Firebase config (not committed)
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   └── package.json
│
├── server/              # Node.js backend
│   ├── config/          # Database config (placeholder)
│   ├── index.js         # Express entry point
│   ├── routes/          # API routes
│   ├── controllers/     # Placeholder for controllers
│   ├── models/          # Placeholder for Mongoose models
│   ├── .env             # Server environment variables (not committed)
│   └── package.json
│
├── .gitignore
├── package.json         # Root scripts for running both apps
└── README.md
```

## Notes

* The project does **not** commit any secrets.  Firebase keys must be provided in your own `.env.local`.  The placeholder `.env.local` file under `client/` shows the required variables.
* The backend includes a stub `connectDB` function in `server/config/db.js`.  It currently logs the MongoDB URL but does not attempt to connect.  When you are ready to add a database, uncomment the connection code and ensure MongoDB is available at the URL specified in `server/.env`.
* To build the client for production, run `npm run build --prefix client` and then serve the output from `client/dist` with your preferred static server.

Feel free to extend and customize this starter to suit the needs of your project.