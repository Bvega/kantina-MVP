import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subscribeToOrder } from '../services/orders';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Clock, 
  ChefHat, 
  Bell, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Coins, 
  MessageSquare 
} from 'lucide-react';

/**
 * OrderStatus displays real-time preparation states for a specific client order.
 */
export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth() || {};
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, (updatedOrder) => {
      setOrder(updatedOrder);
      setLoading(false);
    });
    return unsubscribe;
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50/50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-sm font-semibold text-gray-500">{t('nav_loading')}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50/50 p-6 text-center">
        <HelpCircle className="w-16 h-16 text-orange-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">{t('status_not_found_title')}</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          {t('status_not_found_desc')}
        </p>
        <Link to="/" className="mt-6 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl transition">
          {t('status_not_found_btn')}
        </Link>
      </div>
    );
  }

  const { id, customerName, items, total, status, notes } = order;

  // Timeline steps definitions
  const steps = [
    { key: 'pending', label: t('status_step_received'), desc: t('status_step_received_desc'), icon: <Clock className="w-5 h-5" /> },
    { key: 'preparing', label: t('status_step_cooking'), desc: t('status_step_cooking_desc'), icon: <ChefHat className="w-5 h-5" /> },
    { key: 'ready', label: t('status_step_ready'), desc: t('status_step_ready_desc'), icon: <Bell className="w-5 h-5" /> }
  ];

  // Helper to determine step visual styling
  const getStepStatus = (stepKey, currentStatus) => {
    if (currentStatus === 'cancelled' || currentStatus === 'completed') return 'inactive';

    const statusOrder = ['pending', 'preparing', 'ready'];
    const currentIdx = statusOrder.indexOf(currentStatus);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-3xl p-6 shadow-md space-y-6">
        
        {/* Top Header Card */}
        <div className="text-center border-b border-gray-100 pb-5">
          {order && (
            <Link to={`/menu/${order.vendorId}`} className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 mb-2">
              {t('status_back_menu')}
            </Link>
          )}
          <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">{t('status_header_label')}</span>
          <h2 className="text-xl font-bold text-gray-900 mt-1">{t('order_id')} #{id}</h2>
          <p className="text-sm font-semibold text-gray-600 mt-0.5">{t('history_th_customer')}: {customerName}</p>
        </div>

        {/* Canceled State view */}
        {status === 'cancelled' && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center space-y-2">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="font-bold text-red-800 text-base">{t('status_stage_cancelled')}</h3>
            <p className="text-xs text-red-600 font-medium">
              {t('status_stage_cancelled_desc')}
            </p>
          </div>
        )}

        {/* Completed State view */}
        {status === 'completed' && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="font-bold text-emerald-800 text-base">{t('status_stage_delivered')}</h3>
            <p className="text-xs text-emerald-600 font-medium">
              {t('status_stage_delivered_desc')}
            </p>
          </div>
        )}

        {/* Real-time status tracker timeline */}
        {status !== 'cancelled' && status !== 'completed' && (
          <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {steps.map((step) => {
              const stepStatus = getStepStatus(step.key, status);
              
              let bubbleStyle = 'bg-gray-100 text-gray-400 border-gray-200';
              let lineIndicator = 'bg-gray-200';

              if (stepStatus === 'completed') {
                bubbleStyle = 'bg-orange-100 text-orange-600 border-orange-200';
              } else if (stepStatus === 'active') {
                bubbleStyle = 'bg-orange-600 text-white border-orange-600 ring-4 ring-orange-100 animate-pulse';
              }

              return (
                <div key={step.key} className="relative flex flex-col items-start gap-1">
                  {/* Icon bubble */}
                  <span className={`absolute -left-8 top-0 border flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${bubbleStyle}`}>
                    {stepStatus === 'completed' ? <CheckCircle className="w-4 h-4" /> : step.icon}
                  </span>
                  
                  <span className={`font-bold text-sm leading-tight transition-colors ${
                    stepStatus === 'active' ? 'text-orange-600' : 'text-gray-800'
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-xs text-gray-400 font-medium leading-relaxed">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Recap details */}
        <div className="border-t border-gray-100 pt-5">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('status_details_title')}</h4>
          
          <div className="divide-y divide-gray-50 pb-3">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="py-2.5 flex justify-between text-sm">
                <div className="text-gray-700">
                  <span className="font-bold text-gray-900 mr-2">{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-gray-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {notes && (
            <div className="bg-orange-50/50 rounded-xl p-3 text-xs text-orange-950 flex items-start mb-4">
              <MessageSquare className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-orange-400" />
              <span className="italic">"{notes}"</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm font-semibold text-gray-500 pt-3 border-t border-gray-100">
            <span>{t('order_total')}</span>
            <span className="text-lg font-black text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Support helper */}
        <div className="text-center text-[10px] text-gray-400 font-semibold bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div>{t('status_footer_notice')}</div>
          {user && (
            <Link to="/dashboard" className="mt-2 pt-2 border-t border-gray-100 block text-xs font-bold text-orange-600 hover:text-orange-700">
              {t('status_back_dashboard')}
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
