import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ChefHat } from 'lucide-react';

/**
 * Login page for vendors to sign in and access the dashboard.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor llena todos los campos.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const { user: signedInUser, error: authError } = await login(email, password);
      if (signedInUser) {
        navigate('/dashboard');
      } else {
        // Translate common Firebase errors to Spanish
        if (authError.includes('auth/invalid-credential') || authError.includes('auth/wrong-password') || authError.includes('auth/user-not-found')) {
          setError('Credenciales incorrectas. Intenta de nuevo.');
        } else {
          setError(authError || 'Ocurrió un error al iniciar sesión.');
        }
      }
    } catch (err) {
      setError('Error de conexión. Intenta más tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100/70 p-4">
      <div className="bg-white/95 border border-white rounded-3xl p-8 shadow-xl max-w-sm w-full transition duration-300">
        
        {/* Title / Logo Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md shadow-orange-600/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Iniciar Sesión</h2>
          <p className="text-xs font-semibold text-gray-400 mt-1">Panel de Control de Vendedores</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start text-xs text-red-600 font-bold mb-4">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="nombre@ejemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-2.5 rounded-xl transition duration-150 shadow-md shadow-orange-600/10 flex items-center justify-center"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              'Ingresar a mi Kantina'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <Link to="/" className="text-xs font-bold text-orange-600 hover:text-orange-700">
            ← Volver al Inicio
          </Link>
        </div>

      </div>
    </div>
  );
}
