import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { apiService } from '../services/apiService';

export default function AnalyticsCharts({ selectedZone, selectedType }) {
  const [trends, setTrends] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedZone, selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trendsRes, comparisonRes] = await Promise.all([
        apiService.getTrends({ zone: selectedZone, property_type: selectedType }),
        apiService.getPriceComparison(),
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
        }));
        setComparison(compData);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  return (
    <div className="space-y-6">
      {/* Gráfico de Tendencias */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Tendencia de Precios (Últimos 12 meses)</h3>
        {loading ? (
          <div className="flex justify-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="precio"
                stroke="#667eea"
                strokeWidth={2}
                name="Precio Promedio"
                dot={{ fill: '#667eea', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Comparación por Zona */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Precio Promedio por Zona</h3>
          {loading ? (
            <div className="flex justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="precio" fill="#667eea" name="Precio Promedio" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Propiedades por Zona */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Cantidad de Propiedades</h3>
          {loading ? (
            <div className="flex justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={comparison}
                  dataKey="propiedades"
                  nameKey="zone"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {comparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
