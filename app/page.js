'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'OnlineBet' && password === '20112018') {
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-amber-500">ONLINE BET - REPORT PRO</h1>
            <p className="text-sm text-slate-400 mt-1">Acceso privado al Panel de Conversiones</p>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="Ingresá tu usuario"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg transition duration-200 mt-2"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-amber-500">ONLINE BET - REPORT PRO</h1>
            <p className="text-xs text-slate-400">Panel de Conversiones de WhatsApp a Meta</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-lg border border-slate-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 text-amber-500">REGISTRAR VENTA (PURCHASE)</h2>
          <p className="text-sm text-slate-400 mb-4">Ingresá los datos correspondientes para enviar el evento a Meta.</p>
          {/* Tu estructura de controles y reporte queda activa tras iniciar sesión */}
        </div>
      </div>
    </div>
  );
}
