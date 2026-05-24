import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-orange-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">🍽️ Kantina</h1>
      <p className="mb-6 text-center px-4 max-w-md">
        Bienvenido a Kantina. Plataforma de pedidos para vendedores ambulantes.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition">
          Iniciar Sesión
        </Link>
        <Link to="/dashboard" className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
          Ir al Panel (Test)
        </Link>
      </div>
    </div>
  );
}

export default Home;
