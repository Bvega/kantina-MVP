import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeToActiveOrders, 
  subscribeToCompletedOrders, 
  getVendorMenu, 
  saveVendorMenu, 
  updateOrderStatus, 
  createOrder 
} from '../services/orders';
import OrderList from './OrderList';
import MenuEditor from './MenuEditor';
import QRCodeCard from './QRCodeCard';
import { 
  LogOut, 
  ClipboardList, 
  History, 
  BookOpen, 
  QrCode, 
  PlusCircle, 
  User, 
  Sparkles, 
  DollarSign 
} from 'lucide-react';

/**
 * Dashboard is the primary vendor interface combining tabs for active orders,
 * completed order history, menu configuration, and QR code management.
 */
export default function Dashboard() {
  const { user, logout, isMock } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorId = user?.uid || 'mock-vendor-123';

  // 1. Subscribe to Active Orders
  useEffect(() => {
    const unsubscribe = subscribeToActiveOrders(vendorId, (orders) => {
      setActiveOrders(orders);
    });
    return unsubscribe;
  }, [vendorId]);

  // 2. Subscribe to Completed Orders
  useEffect(() => {
    const unsubscribe = subscribeToCompletedOrders(vendorId, (orders) => {
      setCompletedOrders(orders);
    });
    return unsubscribe;
  }, [vendorId]);

  // 3. Load Vendor Menu
  useEffect(() => {
    async function loadMenu() {
      const menu = await getVendorMenu(vendorId);
      setMenuItems(menu);
      setLoading(false);
    }
    loadMenu();
  }, [vendorId]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (!result.success) {
      alert('Error al actualizar el estado: ' + result.error);
    }
  };

  const handleSaveMenu = async (newItems) => {
    const result = await saveVendorMenu(vendorId, newItems);
    if (result.success) {
      setMenuItems(newItems);
    } else {
      alert('Error al guardar el menú: ' + result.error);
    }
  };

  // Helper to simulate receiving a new order (for demo / testing)
  const handleSimulateIncomingOrder = async () => {
    if (menuItems.length === 0) {
      alert('Primero agrega algunos platillos a tu menú.');
      return;
    }

    const testCustomers = [
      'David Flores', 'María Elena', 'José Luis Ortiz', 
      'Gabriela Cruz', 'Fernando Ruiz', 'Patricia Gómez'
    ];
    const customer = testCustomers[Math.floor(Math.random() * testCustomers.length)];
    
    // Choose 1-3 random items from menu
    const availableItems = menuItems.filter(i => i.available);
    if (availableItems.length === 0) {
      alert('Debes tener al menos un platillo disponible para recibir un pedido.');
      return;
    }

    const orderItemsCount = Math.floor(Math.random() * 2) + 1;
    const selectedItems = [];
    let total = 0;

    for (let i = 0; i < orderItemsCount; i++) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      if (!selectedItems.some(x => x.id === randomItem.id)) {
        const qty = Math.floor(Math.random() * 3) + 1;
        selectedItems.push({
          id: randomItem.id,
          name: randomItem.name,
          price: randomItem.price,
          quantity: qty
        });
        total += randomItem.price * qty;
      }
    }

    const testNotes = [
      'Salsa roja extra.', 'Sin verdura, por favor.', 
      'Para llevar, bien empacado.', '', 'Poner limones.', ''
    ];
    const notes = testNotes[Math.floor(Math.random() * testNotes.length)];

    await createOrder(vendorId, {
      customerName: customer,
      items: selectedItems,
      total,
      notes
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando datos del panel...</p>
        </div>
      </div>
    );
  }

  // Calculating quick statistics for dashboard summary
  const dailyEarnings = completedOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-black text-xl text-gray-900 tracking-tight">
                Kantina<span className="text-orange-600">Panel</span>
              </span>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {/* User badge */}
              <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>{user?.email}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Mode Notice */}
      {isMock && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 shadow-sm text-center text-xs font-bold flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Modo Demostración activo: Los datos se guardan de forma local en tu navegador.</span>
          </div>
          <button
            onClick={handleSimulateIncomingOrder}
            className="flex items-center gap-1 bg-white text-orange-700 hover:bg-orange-50 px-3 py-0.5 rounded-full text-xxs font-black transition-all shadow"
          >
            <PlusCircle className="w-3 h-3" />
            Simular Pedido Entrante
          </button>
        </div>
      )}

      {/* Dashboard Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Short summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pedidos en Curso</div>
            <div className="text-3xl font-black text-gray-900 mt-1">{activeOrders.length}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ventas del Día</div>
            <div className="text-3xl font-black text-emerald-600 mt-1 flex items-baseline">
              <DollarSign className="w-5 h-5 -mr-1.5 shrink-0 self-center text-emerald-500" />
              <span>{dailyEarnings.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pedidos Completados</div>
            <div className="text-3xl font-black text-gray-900 mt-1">
              {completedOrders.filter(o => o.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-1 sm:space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center px-4 py-2.5 border-b-2 font-bold text-sm transition-colors ${
                activeTab === 'active'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Pedidos Activos
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center px-4 py-2.5 border-b-2 font-bold text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="w-4 h-4 mr-2" />
              Historial
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center px-4 py-2.5 border-b-2 font-bold text-sm transition-colors ${
                activeTab === 'menu'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Mi Menú
            </button>

            <button
              onClick={() => setActiveTab('qrcode')}
              className={`flex items-center px-4 py-2.5 border-b-2 font-bold text-sm transition-colors ${
                activeTab === 'qrcode'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Código QR
            </button>
          </nav>
        </div>

        {/* Tab panels content */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[450px]">
          {activeTab === 'active' && (
            <OrderList
              orders={activeOrders}
              onStatusUpdate={handleStatusUpdate}
            />
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Historial de Pedidos</h3>
                <p className="text-xs text-gray-500">Listado de pedidos completados o cancelados del día.</p>
              </div>

              {completedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                  <History className="w-10 h-10 mb-2 text-gray-300" />
                  <p className="font-semibold">Sin historial acumulado hoy</p>
                  <p className="text-xs mt-1">Los pedidos completados se trasladarán a esta pestaña.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                  <table className="min-w-full divide-y divide-gray-100 text-left text-sm text-gray-700 bg-white">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Cliente</th>
                        <th className="px-6 py-3">Detalle</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Estado</th>
                        <th className="px-6 py-3 text-right">Hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {completedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-xs font-semibold text-gray-400">#{order.id}</td>
                          <td className="px-6 py-4 font-bold">{order.customerName}</td>
                          <td className="px-6 py-4 text-xs max-w-xs truncate text-gray-500">
                            {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                              order.status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status === 'completed' ? 'Completado' : 'Cancelado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-gray-400 font-semibold">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <MenuEditor
              menuItems={menuItems}
              onSaveMenu={handleSaveMenu}
            />
          )}

          {activeTab === 'qrcode' && (
            <QRCodeCard
              vendorId={vendorId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
