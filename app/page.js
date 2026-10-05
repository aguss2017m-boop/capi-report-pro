'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Activity, 
  Wifi,
  Plus,
  Phone,
  Save,
  HelpCircle,
  Send,
  DollarSign,
  User,
  Calendar,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Loader2
} from 'lucide-react';
import { supabase } from './supabase';

function DatePickerPopover({ value, onChange, placeholder = "dd/mm/aaaa" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewDate, setViewDate] = useState(parsedDate);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleSelectDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;
    onChange(dateString);
    setIsOpen(false);
  };

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const formatDisplay = (val) => {
    if (!val) return placeholder;
    const [y, m, d] = val.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#07080c] border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-2 text-xs font-semibold text-white flex items-center gap-3 transition-colors"
      >
        <span>{formatDisplay(value)}</span>
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-[#1e2029] border border-gray-700/80 rounded-2xl shadow-2xl w-64 text-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700/50">
            <span className="text-xs font-bold capitalize text-amber-400">
              {monthNames[month]} de {year}
            </span>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={handlePrevMonth} 
                className="p-1 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={handleNextMonth} 
                className="p-1 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 font-bold mb-2 uppercase">
            <span>LU</span><span>MA</span><span>MI</span><span>JU</span><span>VI</span><span>SÁ</span><span>DO</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {Array.from({ length: startingDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const formattedMonth = String(month + 1).padStart(2, '0');
              const formattedDay = String(day).padStart(2, '0');
              const currentDateStr = `${year}-${formattedMonth}-${formattedDay}`;
              const isSelected = value === currentDateStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`p-1.5 rounded-lg text-center transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-black font-extrabold shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                      : 'hover:bg-gray-700 text-gray-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700/50 text-[11px]">
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); }}
              className="text-gray-400 hover:text-red-400 font-medium transition-colors"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                onChange(today);
                setIsOpen(false);
              }}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('registrar');
  const [timeFilter, setTimeFilter] = useState('mes');
  const [searchQuery, setSearchQuery] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [compararAnterior, setCompararAnterior] = useState(false);

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    monto: '',
    moneda: 'ARS',
    estado: 'convertida',
    fecha: new Date().toISOString().split('T')[0],
    nombre: '',
    telefono: '',
    email: '',
    ciudad: '',
    ip: ''
  });

  const [repartoMode, setRepartoMode] = useState('rotativa');
  const [lineas, setLineas] = useState([
    { id: 1, numero: '+54 9 11 1234-5678', activa: true },
    { id: 2, numero: '+54 9 11 8765-4321', activa: true }
  ]);
  const [nuevaLinea, setNuevaLinea] = useState('');

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando ventas:', error);
      } else {
        setVentas(data || []);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const stats = useMemo(() => {
    const total = ventas.length;
    const conv = ventas.filter(v => v.enviado_a_meta).length;
    const pend = total - conv;
    const tasa = total > 0 ? `${Math.round((conv / total) * 100)}%` : '0%';
    const sumaMonto = ventas.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);
    
    return {
      codigosTotales: total,
      convertidas: conv,
      pendientes: pend,
      tasaCierre: tasa,
      totalConvertido: `$${sumaMonto.toLocaleString('es-AR')}`
    };
  }, [ventas]);

  const matchQualityScore = useMemo(() => {
    const fields = ['nombre', 'telefono', 'email', 'ciudad', 'ip'];
    const filledFields = fields.filter((field) => formData[field]?.trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('ventas')
        .insert([
          {
            codigo_cliente: formData.codigo,
            monto: parseFloat(formData.monto),
            moneda: formData.moneda,
            enviado_a_meta: true,
            nombre: formData.nombre || null,
            telefono: formData.telefono || null,
            ciudad: formData.ciudad || null
          }
        ])
        .select();

      if (error) {
        alert('Error al guardar en la base de datos: ' + error.message);
      } else if (data && data[0]) {
        setVentas(prev => [data[0], ...prev]);
        alert('¡Venta registrada con éxito y guardada en Supabase!');
        
        setFormData({
          codigo: '',
          monto: '',
          moneda: 'ARS',
          estado: 'convertida',
          fecha: new Date().toISOString().split('T')[0],
          nombre: '',
          telefono: '',
          email: '',
          ciudad: '',
          ip: ''
        });
      }
    } catch (err) {
      alert('Error inesperado: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgregarLinea = () => {
    if (nuevaLinea.trim()) {
      setLineas(prev => [...prev, { id: Date.now(), numero: nuevaLinea.trim(), activa: true }]);
      setNuevaLinea('');
    }
  };

  const handleEliminarLinea = (id) => {
    setLineas(prev => prev.filter(item => item.id !== id));
  };

  const ventasFiltradas = ventas.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.codigo_cliente?.toLowerCase().includes(query) ||
      v.nombre?.toLowerCase().includes(query) ||
      v.telefono?.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#07080c] text-white p-6 md:p-10 font-sans selection:bg-amber-500 selection:text-black">
      
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-800/60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-200 flex items-center justify-center font-black text-black text-xl shadow-[0_0_25px_rgba(251,191,36,0.85)] border-2 border-yellow-200">
            OB
          </div>
          <span className="text-lg md:text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)] uppercase">
            ONLINE BET - REPORT PRO
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium">
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
          Panel de Conversiones
        </h1>
        <p className="text-sm text-gray-400">
          Reportá ventas de WhatsApp a Meta sin tocar la consola.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button 
          onClick={() => setActiveTab('registrar')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'registrar' 
              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105' 
              : 'bg-[#12141a] text-gray-400 border border-gray-800/80 hover:border-amber-500/50 hover:text-amber-300'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          Registrar Venta
        </button>

        <button 
          onClick={() => setActiveTab('registros')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'registros' 
              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105' 
              : 'bg-[#12141a] text-gray-400 border border-gray-800/80 hover:border-amber-500/50 hover:text-amber-300'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Registros ({stats.codigosTotales})
        </button>

        <button 
          onClick={() => setActiveTab('lineas')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'lineas' 
              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105' 
              : 'bg-[#12141a] text-gray-400 border border-gray-800/80 hover:border-amber-500/50 hover:text-amber-300'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          Líneas
        </button>
      </div>

      {activeTab === 'registrar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          <div className="lg:col-span-2 bg-[#12141a] p-6 md:p-8 rounded-2xl border border-gray-800/80 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-xs">
                1
              </span>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Configuración del Evento (Purchase)
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  CÓDIGO DEL CLIENTE (WHATSAPP) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    placeholder="Ej: LBX3 (pegá el código y autocompletamos IP y ubicación)"
                    required
                    className="w-full bg-[#07080c] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    MONTO DE LA VENTA <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="any"
                      name="monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                      className="w-full bg-[#07080c] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    MONEDA
                  </label>
                  <select
                    name="moneda"
                    value={formData.moneda}
                    onChange={handleInputChange}
                    className="w-full bg-[#07080c] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800/60 space-y-4">
                <p className="text-xs font-bold text-gray-400">Datos del Cliente (Opcional)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">NOMBRE</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                      className="w-full bg-[#07080c] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">TELÉFONO</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="+54 9 260 450..."
                      className="w-full bg-[#07080c] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="juan@email.com"
                      className="w-full bg-[#07080c] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">CIUDAD</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      placeholder="Buenos Aires"
                      className="w-full bg-[#07080c] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">IP DEL CLIENTE</label>
                    <input
                      type="text"
                      name="ip"
                      value={formData.ip}
                      onChange={handleInputChange}
                      placeholder="190.19.XXX.XXX"
                      className="w-full bg-[#07080c] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4"/>
                    Reportar Purchase a Meta
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-[#12141a] p-6 rounded-2xl border border-gray-800/80 shadow-xl h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Calidad del Match
              </h3>
              <span className="text-lg font-black text-amber-400">{matchQualityScore}%</span>
            </div>

            <div className="w-full bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
              <div 
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${matchQualityScore}%` }}
              ></div>
            </div>

            <div className="space-y-2 text-xs mb-6">
              {[
                { label: 'Nombre', key: 'nombre' },
                { label: 'Teléfono', key: 'telefono' },
                { label: 'Email', key: 'email' },
                { label: 'Ciudad', key: 'ciudad' },
                { label: 'IP Cliente', key: 'ip' }
              ].map(({ label, key }) => (
                <div key={key} className="flex justify-between text-gray-400">
                  <span>{label}</span>
                  <span className={formData[key] ? "text-amber-400 font-bold" : "text-gray-600 font-bold"}>
                    {formData[key] ? 'OK ✓' : 'Falta –'}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-800/80 pt-4">
              Completar estos datos envía una señal más fuerte a Meta. Un score de <strong className="text-gray-400">60% o más</strong> puede reducir tu costo por compra.
            </p>
          </div>

        </div>
      )}

      {activeTab === 'registros' && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {['Hoy', '7 días', '15 días', 'Mes', 'Personalizado'].map((filter) => {
              const isSelected = timeFilter === filter.toLowerCase();
              return (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 text-black border border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.4)] scale-105'
                      : 'bg-[#12141a] text-gray-400 border border-gray-800 hover:border-amber-500/40 hover:text-amber-300'
                  }`}
                >
                  {filter}
                </button>
              );
            })}

            {timeFilter === 'personalizado' && (
              <div className="flex flex-wrap items-center gap-2 animate-fadeIn pl-2 border-l border-gray-800">
                <DatePickerPopover
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="dd/mm/aaaa"
                />

                <span className="text-xs text-gray-500 font-bold">→</span>

                <DatePickerPopover
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="dd/mm/aaaa"
                />

                <button
                  type="button"
                  onClick={() => setCompararAnterior(!compararAnterior)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    compararAnterior
                      ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                      : 'bg-[#07080c] border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Comparar con período anterior
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#12141a] p-4 rounded-xl border border-gray-800/80 hover:border-amber-500/30 transition-all group">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">CÓDIGOS TOTALES</p>
              <p className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">{stats.codigosTotales}</p>
            </div>
            <div className="bg-[#12141a] p-4 rounded-xl border border-gray-800/80 hover:border-emerald-500/30 transition-all group">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">CONVERTIDAS</p>
              <p className="text-2xl font-black text-emerald-400">{stats.convertidas}</p>
            </div>
            <div className="bg-[#12141a] p-4 rounded-xl border border-gray-800/80 hover:border-amber-500/30 transition-all group">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">PENDIENTES</p>
              <p className="text-2xl font-black text-amber-400">{stats.pendientes}</p>
            </div>
            <div className="bg-[#12141a] p-4 rounded-xl border border-gray-800/80 hover:border-blue-500/30 transition-all group">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">TASA DE CIERRE</p>
              <p className="text-2xl font-black text-blue-400">{stats.tasaCierre}</p>
            </div>
            <div className="bg-[#12141a] p-4 rounded-xl border border-gray-800/80 hover:border-emerald-500/30 transition-all group">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">TOTAL CONVERTIDO</p>
              <p className="text-2xl font-black text-emerald-400">{stats.totalConvertido}</p>
            </div>
          </div>

          <div className="bg-[#12141a] p-6 rounded-2xl border border-gray-800/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-base font-black text-yellow-400 flex items-center gap-2 tracking-wide uppercase">
                <Activity className="w-4 h-4 text-yellow-400" />
                Registro de Actividad (Supabase)
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por código, cliente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#07080c] border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-yellow-400 text-gray-200 w-60 font-medium"
                  />
                </div>

                <button 
                  onClick={cargarVentas}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#07080c] border border-gray-800 rounded-xl text-xs font-bold text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>

                <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Sincronización Activa
                </div>
              </div>
            </div>

            <div className="border border-gray-800/80 rounded-xl overflow-hidden bg-[#07080c]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#12141a] text-gray-400 border-b border-gray-800 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Fecha / Hora</th>
                    <th className="p-3">Código</th>
                    <th className="p-3">Cliente / Tel</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-gray-400">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Cargando datos desde Supabase...</span>
                        </div>
                      </td>
                    </tr>
                  ) : ventasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-500 font-medium">
                        No hay registros guardados en la base de datos
                      </td>
                    </tr>
                  ) : (
                    ventasFiltradas.map((item) => (
                      <tr key={item.id} className="hover:bg-[#12141a]/60 transition-colors">
                        <td className="p-3 text-gray-300">
                          {new Date(item.created_at).toLocaleString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-400">
                          {item.codigo_cliente}
                        </td>
                        <td className="p-3">
                          <div className="text-white font-medium">{item.nombre || '—'}</div>
                          <div className="text-[10px] text-gray-500">{item.telefono || ''}</div>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                            ✓ Enviado a Meta
                          </span>
                        </td>
                        <td className="p-3 font-bold text-white">
                          ${Number(item.monto).toLocaleString('es-AR')} <span className="text-[10px] text-gray-400">{item.moneda}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'lineas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 bg-[#12141a] p-6 rounded-2xl border border-gray-800/80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-400" />
                Líneas de WhatsApp
              </h2>

              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all">
                <Save className="w-3.5 h-3.5" />
                Guardar cambios
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-6">
              Estos números se aplican a todos los botones de WhatsApp de la landing.
            </p>

            <div className="mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                MODO DE REPARTO
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRepartoMode('rotativa')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    repartoMode === 'rotativa'
                      ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                      : 'bg-[#07080c] text-gray-400 border border-gray-800'
                  }`}
                >
                  Rotativa (Equitativo)
                </button>
                <button
                  type="button"
                  onClick={() => setRepartoMode('prioridad')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    repartoMode === 'prioridad'
                      ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                      : 'bg-[#07080c] text-gray-400 border border-gray-800'
                  }`}
                >
                  Prioridad
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {lineas.map((linea) => (
                <div key={linea.id} className="flex items-center justify-between p-3.5 bg-[#07080c] border border-gray-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-mono font-medium text-white">{linea.numero}</span>
                  </div>
                  <button 
                    onClick={() => handleEliminarLinea(linea.id)}
                    className="text-gray-500 hover:text-red-400 p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="+54 9 11 ..."
                value={nuevaLinea}
                onChange={(e) => setNuevaLinea(e.target.value)}
                className="flex-1 bg-[#07080c] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAgregarLinea}
                className="px-4 py-2.5 bg-amber-400 text-black text-xs font-bold rounded-xl hover:bg-amber-300 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
