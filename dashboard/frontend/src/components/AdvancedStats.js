import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AdvancedStats_v2() {
  const [statsData, setStatsData] = useState(null);
  const [priceComparison, setPriceComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Obtener estadísticas SIN filtros (KPIs globales fijos)
      const [statsRes, priceRes] = await Promise.all([
        apiService.getStats(),
        apiService.getPriceComparison(),
      ]);

      console.log('statsRes:', statsRes);
      console.log('statsRes.data:', statsRes.data);
      setStatsData(statsRes.data);
      // Asegurar que priceComparison siempre sea un array
      const priceData = priceRes.data;
      if (Array.isArray(priceData)) {
        setPriceComparison(priceData);
      } else if (priceData && Array.isArray(priceData.comparison)) {
        setPriceComparison(priceData.comparison);
      } else {
        setPriceComparison([]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Preparar datos para gráfico de propiedades por zona
  const propertiesByZone = statsData?.properties_by_zone 
    ? statsData.properties_by_zone.map((item) => ({
        zone: item.zone ? item.zone.split(' ').pop() : 'Desconocida', // Último palabra para ahorrar espacio
        count: item.count || 0,
      }))
    : [];
  
  console.log('propertiesByZone:', propertiesByZone);

  // Preparar datos para distribución (usar primeras 5 zonas como aproximación)
  const propertyTypeData = propertiesByZone.slice(0, 5) || [];

  // Preparar datos para comparación de precios
  const priceData = Array.isArray(priceComparison) ? priceComparison.map((item) => ({
    zone: item.zone.split(' ').pop(),
    avgPrice: Math.round(item.avg_price / 1000000 * 10) / 10, // En millones
    pricePerM2: Math.round(item.price_per_sqm),
  })) : [];

  return (
    <div className="space-y-6">
      {/* Resumen de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
        >
          <p className="text-gray-600 text-sm">Total Propiedades</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-2">
            {statsData?.total_properties?.toLocaleString('es-MX') || 0}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
        >
          <p className="text-gray-600 text-sm">Precio Promedio</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">
            ${statsData?.average_price ? Math.round(statsData.average_price / 1000000) : 0}M
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200"
        >
          <p className="text-gray-600 text-sm">Rango de Precios</p>
          <h3 className="text-sm font-bold text-orange-600 mt-2">
            ${statsData?.min_price ? Math.round(statsData.min_price / 1000000) : 0}M - ${statsData?.max_price ? Math.round(statsData.max_price / 1000000) : 0}M
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
        >
          <p className="text-gray-600 text-sm">Disponibilidad</p>
          <h3 className="text-3xl font-bold text-purple-600 mt-2">
            {statsData?.total_properties?.toLocaleString('es-MX') || 0}
          </h3>
        </motion.div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Propiedades por zona */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Propiedades por Zona</h3>
          {propertiesByZone && propertiesByZone.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertiesByZone}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="zone" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Sin datos disponibles</p>
            </div>
          )}
        </motion.div>

        {/* Distribución por tipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Tipo</h3>
          {propertyTypeData && propertyTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ zone, count }) => `${zone} ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  animationDuration={800}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString('es-MX')} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Sin datos disponibles</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Análisis de precios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis de Propiedades por Zona</h3>
        {propertiesByZone && propertiesByZone.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={propertiesByZone}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="zone" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #8b5cf6',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorCount)"
                name="Cantidad de Propiedades"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Sin datos disponibles</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
