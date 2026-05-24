import React from 'react';
import OrderCard from './OrderCard';
import { Sparkles, HelpCircle, Utensils, BellRing } from 'lucide-react';

/**
 * OrderList groups active orders into columns based on their state (pending, preparing, ready).
 */
export default function OrderList({ orders, onStatusUpdate }) {
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  const columns = [
    {
      title: 'Por Confirmar',
      accent: 'border-amber-500 text-amber-800',
      countBg: 'bg-amber-100 text-amber-800',
      list: pendingOrders,
      icon: <BellRing className="w-5 h-5 mr-2" />,
      emptyMessage: 'Sin pedidos nuevos',
      emptyIcon: <HelpCircle className="w-8 h-8 text-amber-300 mb-2" />
    },
    {
      title: 'En Cocina',
      accent: 'border-blue-500 text-blue-800',
      countBg: 'bg-blue-100 text-blue-800',
      list: preparingOrders,
      icon: <Utensils className="w-5 h-5 mr-2" />,
      emptyMessage: 'Cocina despejada',
      emptyIcon: <Sparkles className="w-8 h-8 text-blue-300 mb-2" />
    },
    {
      title: 'Listo para Entrega',
      accent: 'border-emerald-500 text-emerald-800',
      countBg: 'bg-emerald-100 text-emerald-800',
      list: readyOrders,
      icon: <BellRing className="w-5 h-5 mr-2" />, // Or another icon like PackageCheck
      emptyMessage: 'Nada listo para recoger',
      emptyIcon: <BellRing className="w-8 h-8 text-emerald-300 mb-2" />
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((col, idx) => (
        <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex flex-col min-h-[500px]">
          {/* Column Header */}
          <div className={`flex justify-between items-center pb-3 mb-4 border-b-2 ${col.accent}`}>
            <h2 className="text-base font-bold flex items-center">
              {col.icon}
              {col.title}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${col.countBg}`}>
              {col.list.length}
            </span>
          </div>

          {/* Orders Column Body */}
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[700px] scrollbar-thin">
            {col.list.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[250px] border border-dashed border-gray-200 rounded-xl bg-white/40 p-6 text-center">
                {col.emptyIcon}
                <p className="text-sm font-semibold text-gray-500">{col.emptyMessage}</p>
                <p className="text-xs text-gray-400 mt-1">Los nuevos pedidos aparecerán aquí automáticamente.</p>
              </div>
            ) : (
              col.list.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={onStatusUpdate}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
