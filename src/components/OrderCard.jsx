import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle2, Trash2, Coins, MessageSquare, Check } from 'lucide-react';

/**
 * Formats time elapsed from a given ISO string or Timestamp.
 */
function formatTimeElapsed(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Hace un momento';
  if (diffMins < 60) return `Hace ${diffMins} min${diffMins > 1 ? 's' : ''}`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
  
  return date.toLocaleDateString();
}

/**
 * OrderCard displays details for a single order and triggers status updates.
 */
export default function OrderCard({ order, onStatusUpdate }) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    setElapsed(formatTimeElapsed(order.createdAt));
    const timer = setInterval(() => {
      setElapsed(formatTimeElapsed(order.createdAt));
    }, 30000); // Update every 30 seconds
    return () => clearInterval(timer);
  }, [order.createdAt]);

  const { id, customerName, items, total, status, notes } = order;

  // Status configuration mappings
  const statusStyles = {
    pending: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800',
      badgeText: 'Pendiente',
      btnText: 'Preparar',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      btnIcon: <ChefHat className="w-4 h-4 mr-2" />,
      nextStatus: 'preparing'
    },
    preparing: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-800',
      badgeText: 'Preparando',
      btnText: 'Listo',
      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      btnIcon: <CheckCircle2 className="w-4 h-4 mr-2" />,
      nextStatus: 'ready'
    },
    ready: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      badgeText: 'Listo para Entrega',
      btnText: 'Completar',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      btnIcon: <Check className="w-4 h-4 mr-2" />,
      nextStatus: 'completed'
    }
  };

  const style = statusStyles[status] || {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    badgeBg: 'bg-gray-100 text-gray-800',
    badgeText: status
  };

  return (
    <div className={`border rounded-xl p-5 ${style.bg} ${style.border} shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between h-full`}>
      {/* Header */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Orden #{id}</span>
            <h3 className="text-lg font-bold text-gray-800 mt-0.5">{customerName}</h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.badgeBg}`}>
            {style.badgeText}
          </span>
        </div>

        {/* Time Stamp */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span>{elapsed}</span>
        </div>

        {/* Items List */}
        <div className="border-t border-b border-gray-100 py-3 mb-4 space-y-2">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="flex justify-between items-center text-sm">
              <div className="text-gray-700">
                <span className="font-bold text-gray-900 mr-2">{item.quantity}x</span>
                <span>{item.name}</span>
              </div>
              <span className="text-gray-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Notes (if any) */}
        {notes && (
          <div className="bg-amber-100/60 rounded-lg p-2.5 text-xs text-amber-900 flex items-start mb-4">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
            <span className="italic">"{notes}"</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm font-semibold text-gray-500">
            <Coins className="w-4 h-4 mr-1 text-gray-400" />
            Total Cobrado
          </div>
          <span className="text-xl font-black text-gray-900">${total.toFixed(2)}</span>
        </div>

        <div className="flex gap-2">
          {/* Action button */}
          {style.btnText && (
            <button
              onClick={() => onStatusUpdate(id, style.nextStatus)}
              className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg font-bold text-sm transition-colors duration-200 ${style.btnBg}`}
            >
              {style.btnIcon}
              {style.btnText}
            </button>
          )}

          {/* Cancel button */}
          {(status === 'pending' || status === 'preparing') && (
            <button
              onClick={() => onStatusUpdate(id, 'cancelled')}
              title="Cancelar Pedido"
              className="p-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
