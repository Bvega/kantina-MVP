import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// ==========================================
// MOCK DATA FALLBACKS (Local Storage)
// ==========================================
const MOCK_MENU_KEY = "kantina_mock_menu";
const MOCK_ORDERS_KEY = "kantina_mock_orders";

const defaultMockMenu = [
  { id: "item-1", name: "Tacos de Canasta", price: 15, category: "Tacos", description: "Tacos sudados de papa, chicharrón prensado o frijol.", available: true },
  { id: "item-2", name: "Quesadilla de Huitlacoche", price: 35, category: "Quesadillas", description: "Quesadilla con queso Oaxaca y huitlacoche.", available: true },
  { id: "item-3", name: "Agua de Horchata", price: 20, category: "Bebidas", description: "Agua fresca artesanal de horchata (Grande).", available: true },
  { id: "item-4", name: "Gordita de Chicharrón", price: 30, category: "Gorditas", description: "Gordita de maíz rellena de chicharrón prensado.", available: true },
];

const defaultMockOrders = [
  { 
    id: "ord-101", 
    customerName: "Juan Pérez", 
    items: [
      { id: "item-1", name: "Tacos de Canasta", price: 15, quantity: 4 },
      { id: "item-3", name: "Agua de Horchata", price: 20, quantity: 1 }
    ], 
    total: 80, 
    status: "pending", 
    notes: "Con mucha salsa verde, por favor.", 
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString() 
  },
  { 
    id: "ord-102", 
    customerName: "Sofía Medina", 
    items: [
      { id: "item-2", name: "Quesadilla de Huitlacoche", price: 35, quantity: 2 }
    ], 
    total: 70, 
    status: "preparing", 
    notes: "Bien doradita la quesadilla.", 
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() 
  }
];

// Helper to initialize local storage data if not present
function initializeMockLocalStorage() {
  if (!localStorage.getItem(MOCK_MENU_KEY)) {
    localStorage.setItem(MOCK_MENU_KEY, JSON.stringify(defaultMockMenu));
  }
  if (!localStorage.getItem(MOCK_ORDERS_KEY)) {
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(defaultMockOrders));
  }
}

// ==========================================
// MENU SERVICES
// ==========================================

/**
 * Fetch the vendor's menu.
 * @param {string} vendorId 
 * @returns {Promise<Array>}
 */
export async function getVendorMenu(vendorId) {
  if (!isFirebaseConfigured) {
    initializeMockLocalStorage();
    const menu = JSON.parse(localStorage.getItem(MOCK_MENU_KEY));
    return menu;
  }

  try {
    const docRef = doc(db, 'menus', vendorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
}

/**
 * Save/overwrite the vendor's menu.
 * @param {string} vendorId 
 * @param {Array} items 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function saveVendorMenu(vendorId, items) {
  if (!isFirebaseConfigured) {
    localStorage.setItem(MOCK_MENU_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("kantina_mock_menu_change"));
    return { success: true };
  }

  try {
    const docRef = doc(db, 'menus', vendorId);
    await setDoc(docRef, { items, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving menu:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// REAL-TIME ORDERS SERVICES
// ==========================================

/**
 * Listen to orders in real-time.
 * Filters active orders (pending, preparing, ready).
 * @param {string} vendorId 
 * @param {Function} callback Called with updated orders list
 * @returns {Function} Unsubscribe function
 */
export function subscribeToActiveOrders(vendorId, callback) {
  if (!isFirebaseConfigured) {
    initializeMockLocalStorage();
    
    const emitActive = () => {
      const allOrders = JSON.parse(localStorage.getItem(MOCK_ORDERS_KEY)) || [];
      const active = allOrders.filter(o => o.status !== "completed" && o.status !== "cancelled");
      // Sort oldest first for prep queue
      active.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      callback(active);
    };

    emitActive();
    
    const handler = () => emitActive();
    window.addEventListener("kantina_mock_orders_change", handler);
    return () => window.removeEventListener("kantina_mock_orders_change", handler);
  }

  const q = query(
    collection(db, 'orders'),
    where('vendorId', '==', vendorId),
    where('status', 'in', ['pending', 'preparing', 'ready']),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    callback(orders);
  }, (error) => {
    console.error("Error in active orders snapshot:", error);
  });
}

/**
 * Listen to completed/history orders in real-time.
 * @param {string} vendorId 
 * @param {Function} callback 
 * @returns {Function} Unsubscribe function
 */
export function subscribeToCompletedOrders(vendorId, callback) {
  if (!isFirebaseConfigured) {
    initializeMockLocalStorage();
    
    const emitCompleted = () => {
      const allOrders = JSON.parse(localStorage.getItem(MOCK_ORDERS_KEY)) || [];
      const completed = allOrders.filter(o => o.status === "completed" || o.status === "cancelled");
      // Sort newest first for history
      completed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(completed);
    };

    emitCompleted();
    
    const handler = () => emitCompleted();
    window.addEventListener("kantina_mock_orders_change", handler);
    return () => window.removeEventListener("kantina_mock_orders_change", handler);
  }

  const q = query(
    collection(db, 'orders'),
    where('vendorId', '==', vendorId),
    where('status', 'in', ['completed', 'cancelled']),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    callback(orders);
  }, (error) => {
    console.error("Error in completed orders snapshot:", error);
  });
}

/**
 * Update the status of an order.
 * @param {string} orderId 
 * @param {string} newStatus 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateOrderStatus(orderId, newStatus) {
  if (!isFirebaseConfigured) {
    const allOrders = JSON.parse(localStorage.getItem(MOCK_ORDERS_KEY)) || [];
    const index = allOrders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      allOrders[index].status = newStatus;
      localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(allOrders));
      window.dispatchEvent(new Event("kantina_mock_orders_change"));
      return { success: true };
    }
    return { success: false, error: "Order not found" };
  }

  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new order (useful for customer-facing client and simulations).
 * @param {string} vendorId 
 * @param {object} orderData {customerName, items, total, notes}
 * @returns {Promise<{success: boolean, orderId?: string, error?: string}>}
 */
export async function createOrder(vendorId, orderData) {
  if (!isFirebaseConfigured) {
    initializeMockLocalStorage();
    const allOrders = JSON.parse(localStorage.getItem(MOCK_ORDERS_KEY)) || [];
    
    const newOrder = {
      id: `ord-${Math.floor(100 + Math.random() * 900)}`,
      vendorId,
      customerName: orderData.customerName,
      items: orderData.items,
      total: orderData.total,
      status: "pending",
      notes: orderData.notes || "",
      createdAt: new Date().toISOString()
    };
    
    allOrders.push(newOrder);
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(allOrders));
    window.dispatchEvent(new Event("kantina_mock_orders_change"));
    
    return { success: true, orderId: newOrder.id };
  }

  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      vendorId,
      customerName: orderData.customerName,
      items: orderData.items,
      total: orderData.total,
      status: "pending",
      notes: orderData.notes || "",
      createdAt: serverTimestamp()
    });
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen to updates on a single order in real-time.
 * @param {string} orderId 
 * @param {Function} callback Called with the updated order object or null if not found
 * @returns {Function} Unsubscribe function
 */
export function subscribeToOrder(orderId, callback) {
  if (!isFirebaseConfigured) {
    initializeMockLocalStorage();
    
    const emitOrder = () => {
      const allOrders = JSON.parse(localStorage.getItem(MOCK_ORDERS_KEY)) || [];
      const order = allOrders.find(o => o.id === orderId);
      callback(order || null);
    };

    emitOrder();
    
    const handler = () => emitOrder();
    window.addEventListener("kantina_mock_orders_change", handler);
    return () => window.removeEventListener("kantina_mock_orders_change", handler);
  }

  const docRef = doc(db, 'orders', orderId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error in single order snapshot:", error);
  });
}
