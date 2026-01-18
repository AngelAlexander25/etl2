import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function AdvancedAnalytics({ selectedZone, selectedType }) {
  const [trends, setTrends] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [trendsRes, comparisonRes] = await Promise.all([
        apiService.getTrends({ zone: selectedZone, property_type: selectedType }),
        apiService.getPriceComparison(),
        apiService.getStats(),
      ]);

      // Procesar tendencias
      if (trendsRes.data.trends) {
        const groupedTrends = {};
        trendsRes.data.trends.forEach(item => {
          if (!groupedTrends[item.month]) {
            groupedTrends[item.month] = {
              month: item.month,
              average_price: 0,
              count: 0,
            };
          }
          groupedTrends[item.month].average_price += item.average_price;
          groupedTrends[item.month].count += 1;
        });

        const trendData = Object.values(groupedTrends).map(item => ({
          month: item.month,
          precio: Math.round(item.average_price / item.count),
        }));

        setTrends(trendData);
      }

      // Procesar comparación
      if (comparisonRes.data.zones) {
        const compData = comparisonRes.data.zones.map(zone => ({
          zone: zone.zone,
          precio: Math.round(zone.avg_price),
          propiedades: zone.property_count,
          ppm: Math.round(zone.avg_price_per_sqm),
        }));
        setComparison(compData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedZone, selectedType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const COLORS = ['#0ea5e9', '#06b6d4', '#3b82f6', '#1d4ed8', '#1e40af'];

  return (
    <div className="space-y-6">
      {/* Gráfico de Tendencias - Área */}
      <div className="bg-white rounded-xl card-shadow p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Evolución de Precios (Últimos 12 meses)</h3>
        </div>
        {loading ? (
          <div className="flex justify-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorPrecio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `$${(value).toLocaleString()}`}
              />
              <Area
                type="monotone"
                dataKey="precio"
                stroke="#0284c7"
                fillOpacity={1}
                fill="url(#colorPrecio)"
                name="Precio Promedio"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparación de Precios por Zona */}
        <div className="bg-white rounded-xl card-shadow p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Precio Promedio por Zona</h3>
          {loading ? (
            <div className="flex justify-center h-80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparison} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis dataKey="zone" type="category" stroke="#6b7280" style={{ fontSize: '11px' }} width={110} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Bar dataKey="precio" fill="#0ea5e9" name="Precio Promedio" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Distribución de Propiedades */}
        <div className="bg-white rounded-xl card-shadow p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Cantidad de Propiedades por Zona</h3>
          {loading ? (
            <div className="flex justify-center h-80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={comparison}
                  dataKey="propiedades"
                  nameKey="zone"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ zone, value }) => `${zone}: ${value}`}
                  labelLine={false}
                >
                  {comparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} propiedades`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Precio por m² por Zona */}
      <div className="bg-white rounded-xl card-shadow p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Precio por m² - Análisis Comparativo</h3>
        {loading ? (
          <div className="flex justify-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="zone" stroke="#6b7280" angle={-45} textAnchor="end" height={80} style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `$${value.toLocaleString()}/m²`}
              />
              <Bar dataKey="ppm" fill="#06b6d4" name="Precio por m²" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
