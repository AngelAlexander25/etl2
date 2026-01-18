import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Menu, X, Home } from 'lucide-react';
import KPICard from './components/KPICard';
import FilterPanel from './components/FilterPanel';
import MapViewAdvanced from './components/MapViewAdvanced';
import AdvancedStats from './components/AdvancedStats';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import PropertiesGrid from './components/PropertiesGrid';
import ROICalculator from './components/ROICalculator';
import { apiService } from './services/apiService';
import './App.css';

function App() {
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    zone: '',
    property_type: '',
    min_price: 0,
    max_price: 50000000,
    bedrooms: '',
    has_pool: '',
    has_ocean_view: '',
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Cargar stats SOLO UNA VEZ al montar (sin filtros)
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('Fetching stats (KPIs globales fijos)');
      // Obtener stats SIN filtros - KPIs globales
      const response = await apiService.getStats({});
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFiltersChange = (newFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Home },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
    { id: 'roi', label: 'ROI', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Mejorado */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-2xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Dashboard Cancún
                </h1>
                <p className="text-blue-100 text-xs">Real Estate Analytics</p>
              </div>
            </div>

            {/* Navegación Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Botones Acción */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowGuide(!showGuide)}
                className="hidden md:block px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition font-medium"
              >
                ℹ️ Guía
              </motion.button>

              {/* Menu Móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Menú Móvil */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/20 py-4 space-y-2"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Guía Visual */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">📚 Guía de Uso</h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">🗺️ Resumen</h4>
                  <p className="text-sm text-gray-700">
                    Visualiza todas tus propiedades en el mapa. Usa los filtros a la izquierda
                    para buscar por zona, tipo, precio y características. Haz clic en los
                    markers para ver detalles.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">📊 Análisis</h4>
                  <p className="text-sm text-gray-700">
                    Explora gráficos detallados del mercado. Ve propiedades por zona, distribución
                    por tipo, y análisis de precios con tendencias de los últimos 12 meses.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">💰 ROI</h4>
                  <p className="text-sm text-gray-700">
                    Calcula rentabilidad de inversiones. Ingresa precio de propiedad, renta mensual
                    y tasa de apreciación para ver proyecciones a 10 años.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  💡 <strong>Consejo:</strong> Los filtros requieren que hagas clic en "Aplicar"
                  para actualizar los resultados.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPIs */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <KPICard
              title="Total de Propiedades"
              value={stats?.total_properties || 0}
              icon={Home}
              color="blue"
              trend={2.5}
            />
            <KPICard
              title="Precio Promedio"
              value={Math.round(stats?.average_price / 1000000) || 0}
              unit="M"
              icon={DollarSign}
              color="green"
              trend={1.8}
            />
            <KPICard
              title="Disponibles"
              value={stats?.total_properties || 0}
              icon={TrendingUp}
              color="orange"
              trend={-0.5}
            />
            <KPICard
              title="Rango de Precios"
              value={`${Math.round(stats?.min_price / 1000000)}-${Math.round(stats?.max_price / 1000000)}M`}
              icon={DollarSign}
              color="purple"
            />
          </motion.div>
        )}

        {/* Content por Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filtros */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Mapa y Propiedades */}
            <div className="lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <MapViewAdvanced filters={filters} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <PropertiesGrid filters={filters} />
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AdvancedStats />
            <div className="mt-8">
              <AdvancedAnalytics />
            </div>
          </motion.div>
        )}

        {activeTab === 'roi' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ROICalculator />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-8 mt-16">
        <p className="text-sm">
          <span className="font-semibold text-white">Dashboard Cancún</span> • Creado por Angel
          Alexander • 2024
        </p>
      </footer>
    </div>
  );
}

export default App;
