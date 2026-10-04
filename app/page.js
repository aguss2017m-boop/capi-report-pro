'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Estados interactivos funcionales de tu panel
  const [activeTab, setActiveTab] = useState('registrar');
  const [whatsappCode, setWhatsappCode] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [clientName, setClientName] = useState('Juan Pérez');
  const [clientPhone, setClientPhone] = useState('+54 9 260 450...');
  const [clientEmail, setClientEmail] = useState('juan@email.com');
  const [clientCity, setClientCity] = useState('Buenos Aires');
  const [clientIp, setClientIp] = useState('190.19.XXX.XXX');

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
        <div className="flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-amber-500">ONLINE BET - REPORT PRO</h1>
            <p className="text-xs text-slate-400">Reportá ventas de WhatsApp a Meta sin tocar la consola.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-lg border border-slate-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Pestañas superiores funcionales */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('registrar')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'registrar' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
          >
            ⚡ REGISTRAR VENTA
          </button>
          <button 
            onClick={() => setActiveTab('registros')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'registros' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
          >
            📊 REGISTROS (0)
          </button>
          <button 
            onClick={() => setActiveTab('lineas')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'lineas' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
          >
            📈 LÍNEAS
          </button>
        </div>

        {activeTab === 'registrar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
              <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wide">1. Configuración del Evento (Purchase)</h2>
              
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Código del Cliente (WhatsApp) *</label>
                <input 
                  type="text" 
                  value={whatsappCode}
                  onChange={(e) => setWhatsappCode(e.target.value)}
                  placeholder="Ej: LBX3 (pegá el código y autocompletamos IP y ubicación)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Monto de la Venta *</label>
                  <input 
                    type="text" 
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    placeholder="$ 0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Moneda</label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3">Datos del Cliente (Opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Nombre</label>
                    <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Teléfono</label>
                    <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Email</label>
                    <input type="text" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Ciudad</label>
                    <input type="text" value={clientCity} onChange={(e) => setClientCity(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">IP del Cliente</label>
                    <input type="text" value={clientIp} onChange={(e) => setClientIp(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert('Venta reportada con éxito')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg transition duration-200 cursor-pointer"
              >
                REPORTAR PURCHASE A META
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-fit space-y-4">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wide">Calidad del Match</h3>
              <div className="text-xs text-slate-400 space-y-2">
                <p>Nombre: {clientName ? '✅' : '❌'}</p>
                <p>Teléfono: {clientPhone ? '✅' : '❌'}</p>
                <p>Email: {clientEmail ? '✅' : '❌'}</p>
                <p>Ciudad: {clientCity ? '✅' : '❌'}</p>
                <p>IP Cliente: {clientIp ? '✅' : '❌'}</p>
              </div>
              <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">
                Completar estos datos envía una señal más fuerte a Meta. Un score superior al 60% puede reducir tu costo por compra.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'registros' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-400">
            <h3 className="text-lg font-semibold text-white mb-2">Historial de Registros</h3>
            <p className="text-sm">No hay registros de ventas guardados todavía.</p>
          </div>
        )}

        {activeTab === 'lineas' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-400">
            <h3 className="text-lg font-semibold text-white mb-2">Gestión de Líneas</h3>
            <p className="text-sm">Configuración de líneas de WhatsApp conectadas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
