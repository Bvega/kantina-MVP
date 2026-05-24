import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorMenu, createOrder } from '../services/orders';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  User, 
  Clipboard, 
  Check, 
  ChefHat 
} from 'lucide-react';

/**
 * CustomerMenu is a public page that lets clients browse the vendor's menu,
 * customize an order, and submit it directly to the kitchen.
 */
export default function CustomerMenu() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  // Cart states
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      const menu = await getVendorMenu(vendorId || 'mock-vendor-123');
      // Filter out unavailable items for customers
      setMenuItems(menu.filter(item => item.available));
      setLoading(false);
    }
    fetchMenu();
  }, [vendorId]);

  // Extract unique categories
  const categories = ['Todos', ...new Set(menuItems.map(item => item.category))];

  const handleAddToCart = (item) => {
    setCart(prev => {
      const qty = prev[item.id] ? prev[item.id].quantity + 1 : 1;
      return {
        ...prev,
        [item.id]: { ...item, quantity: qty }
      };
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(prev => {
      if (!prev[itemId]) return prev;
      const nextQty = prev[itemId].quantity - 1;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: { ...prev[itemId], quantity: nextQty }
      };
    });
  };

  const cartArray = Object.values(cart);
  const cartTotalItems = cartArray.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cartArray.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartTotalItems === 0) return;
    if (!customerName.trim()) {
      alert('Por favor ingresa tu nombre o número de mesa.');
      return;
    }

    setSubmitting(true);
    
    const orderData = {
      customerName: customerName.trim(),
      items: cartArray,
      total: cartTotalPrice,
      notes: notes.trim()
    };

    try {
      const result = await createOrder(vendorId || 'mock-vendor-123', orderData);
      if (result.success && result.orderId) {
        // Clear cart
        setCart({});
        setIsCartOpen(false);
        // Redirect to live order tracking screen
        navigate(`/order-status/${result.orderId}`);
      } else {
        alert('Hubo un problema al crear tu pedido: ' + result.error);
      }
    } catch (err) {
      alert('Error de conexión. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = activeCategory === 'Todos'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50/50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-sm font-semibold text-gray-500">Cargando menú delicioso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative pb-20 sm:pb-0">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-orange-500 to-terracotta-600 text-white py-8 px-6 text-center shadow-md">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white mb-2 mx-auto">
          <ChefHat className="w-5 h-5" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">KANTINA MENU</h1>
        <p className="text-xs font-semibold opacity-90 mt-0.5">Pide al instante en un par de clics</p>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 p-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu list */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-sm">Menú no disponible por el momento</p>
            <p className="text-xs text-gray-400 mt-1">El vendedor no ha habilitado platillos en esta sección.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                {item.description && (
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.description}</p>
                )}
                <div className="text-base font-black text-gray-900 mt-1.5">${item.price.toFixed(2)}</div>
              </div>

              {/* Add item control */}
              <div className="shrink-0">
                {cart[item.id] ? (
                  <div className="flex items-center gap-2 border border-orange-200 bg-orange-50 rounded-xl px-2 py-1 text-sm">
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-1 text-orange-700 hover:bg-orange-100 rounded-lg transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-orange-950 px-1">{cart[item.id].quantity}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="p-1 text-orange-700 hover:bg-orange-100 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="p-2 border border-orange-200 hover:bg-orange-50 text-orange-600 rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Floating Bottom Bar (visible when cart has items) */}
      {cartTotalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="max-w-xl mx-auto flex items-center justify-between w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-orange-600/25 transition duration-150"
          >
            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="w-5 h-5" />
              <span>Ver Pedido</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-black">
                {cartTotalItems}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-base">
              <span>${cartTotalPrice.toFixed(2)}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
          
          {/* Drawer container */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-slide-in">
            {/* Top Header */}
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-bold text-gray-800">Mi Orden</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items in cart */}
              <div className="overflow-y-auto max-h-[300px] divide-y divide-gray-50 py-2">
                {cartArray.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-400 font-semibold mt-0.5">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-950">${(item.price * item.quantity).toFixed(2)}</span>
                      <div className="flex items-center gap-1.5 border border-gray-100 bg-gray-50 rounded-lg p-0.5 text-xs">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black px-1 text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-gray-100">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  ¿A nombre de quién? / Mesa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez (Mesa 4)"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 bg-white"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center">
                  <Clipboard className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  Instrucciones especiales (opcional)
                </label>
                <textarea
                  placeholder="Ej. Sin cebolla, salsa extra, servilletas..."
                  rows={2}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 bg-white resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-sm font-semibold text-gray-500 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Método de pago</span>
                  <span>Efectivo al Recibir</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-100 pt-2 mt-1">
                  <span>Total</span>
                  <span>${cartTotalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Checkout Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition duration-150 shadow-md shadow-orange-600/10 flex items-center justify-center"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  'Confirmar Pedido 🍽️'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
