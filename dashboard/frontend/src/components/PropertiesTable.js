import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Download, Building2 } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function PropertiesTable({ filters }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'desc' });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProperties({
        ...filters,
        limit: 50,
      });
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedProperties = [...properties].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const exportToCSV = () => {
    const headers = ['ID', 'Tipo', 'Zona', 'Precio', 'Recámaras', 'Alberca', 'Vista al Mar', 'm²'];
    const rows = sortedProperties.map(prop => [
      prop.id,
      prop.property_type,
      prop.zone,
      prop.price,
      prop.bedrooms,
      prop.has_pool ? 'Sí' : 'No',
      prop.has_ocean_view ? 'Sí' : 'No',
      prop.area_sqm,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `propiedades_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const SortHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-2 hover:text-blue-600 transition-colors font-semibold"
    >
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-xl card-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Propiedades Disponibles ({sortedProperties.length})
          </h2>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Descargar CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">
                  <SortHeader label="Tipo" sortKey="property_type" />
                </th>
                <th className="px-6 py-4 text-left text-gray-700">
                  <SortHeader label="Zona" sortKey="zone" />
                </th>
                <th className="px-6 py-4 text-right text-gray-700">
                  <SortHeader label="Precio" sortKey="price" />
                </th>
                <th className="px-6 py-4 text-center text-gray-700 font-semibold">
                  Recámaras
                </th>
                <th className="px-6 py-4 text-center text-gray-700 font-semibold">
                  m²
                </th>
                <th className="px-6 py-4 text-center text-gray-700 font-semibold">
                  Alberca
                </th>
                <th className="px-6 py-4 text-center text-gray-700 font-semibold">
                  Vista Mar
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedProperties.map((property, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">{property.property_type}</td>
                  <td className="px-6 py-4 text-gray-700">{property.zone}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{property.bedrooms}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{property.area_sqm?.toFixed(0) || 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.has_pool ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {property.has_pool ? '✓ Sí' : '✗ No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.has_ocean_view ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'}`}>
                      {property.has_ocean_view ? '✓ Sí' : '✗ No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
