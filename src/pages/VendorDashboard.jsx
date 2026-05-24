import React from 'react';

function VendorDashboard() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-orange-600">📊 Panel del Vendedor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Resumen de Pedidos</h2>
          <p className="text-gray-600">Aquí irán los datos de pedidos del día.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Menú</h2>
          <p className="text-gray-600">Aquí el vendedor podrá editar el menú.</p>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;

