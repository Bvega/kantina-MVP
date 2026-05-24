import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, QrCode, TrendingUp, BellRing, ArrowRight } from 'lucide-react';

/**
 * Kantina landing page with premium call-to-actions and platform features.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-800">
      
      {/* Navbar */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <span className="font-black text-xl tracking-tight text-gray-900">
            Kantina
          </span>
        </div>
        <Link 
          to="/login" 
          className="px-4 py-2 border border-orange-600 text-orange-600 hover:bg-orange-50 font-bold text-xs sm:text-sm rounded-xl transition duration-150"
        >
          Acceso Vendedores
        </Link>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 text-center my-10 sm:my-16">
        
        {/* Badge */}
        <div className="bg-orange-100 text-orange-800 text-[10px] sm:text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-6 flex items-center gap-1.5 animate-pulse">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Para Vendedores Ambulantes y Comida Callejera</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 leading-tight">
          Moderniza tu puesto de comida con <span className="text-orange-600">Kantina</span>
        </h1>

        {/* Description */}
        <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl font-semibold leading-relaxed">
          Tus clientes escanean un código QR, eligen sus platillos favoritos y tú recibes los pedidos y pagos al instante en tu celular. Sin filas, sin errores, sin complicaciones.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/login" 
            className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2"
          >
            <span>Comenzar Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            to="/dashboard" 
            className="px-8 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition shadow-sm flex items-center justify-center"
          >
            Ver Demostración
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 sm:mt-24 text-left w-full">
          
          <div className="bg-white/60 border border-white rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Código QR Autogenerado</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Descarga e imprime tu código QR único. Colócalo en tus mesas para que tus comensales ordenen sin necesidad de instalar apps.
            </p>
          </div>

          <div className="bg-white/60 border border-white rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Pedidos en Tiempo Real</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Entérate al instante mediante notificaciones y sonidos cada vez que entra un nuevo pedido a tu cocina digital.
            </p>
          </div>

          <div className="bg-white/60 border border-white rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Administra tu Menú</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Modifica precios, agrega nuevos platillos o desactiva de forma inmediata las opciones que se hayan agotado en el día.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/40 py-6 mt-16 text-center text-xs text-gray-400 font-semibold">
        <p>© {new Date().getFullYear()} Kantina. Diseñado para empoderar el comercio local.</p>
      </footer>

    </div>
  );
}
