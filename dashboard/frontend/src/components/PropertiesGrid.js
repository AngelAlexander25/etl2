import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Bed, Maximize2, Heart, Download } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function PropertiesGrid({ filters }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos del localStorage
    try {
      return JSON.parse(localStorage.getItem('propertyFavorites')) || [];
    } catch (e) {
      return [];
    }
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching properties with filters:', filters);
      const response = await apiService.getProperties({
        ...filters,
        limit: 50,
      });
      console.log('Properties response:', response.data);
      const propsData = Array.isArray(response.data) ? response.data : (response.data.properties || []);
      setProperties(propsData);
      console.log('Set properties:', propsData.length, 'items');
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const exportToCSV = () => {
    const headers = ['ID', 'Tipo', 'Zona', 'Precio', 'Recámaras', 'Baños', 'Área (m2)', 'Alberca', 'Vista al Mar'];
    const rows = properties.map(prop => [
      prop.id,
      prop.property_type,
      prop.zone,
      prop.price,
      prop.bedrooms,
      prop.bathrooms || 'N/A',
      prop.area_sqm || 'N/A',
      prop.has_pool ? 'Sí' : 'No',
      prop.has_ocean_view ? 'Sí' : 'No',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `propiedades_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(propertyId)
        ? prevFavorites.filter(id => id !== propertyId)
        : [...prevFavorites, propertyId];
      
      // Guardar en localStorage
      localStorage.setItem('propertyFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPriceColor = (price) => {
    if (price < 2000000) return 'from-green-50 to-green-100 border-green-200';
    if (price < 5000000) return 'from-blue-50 to-blue-100 border-blue-200';
    if (price < 10000000) return 'from-orange-50 to-orange-100 border-orange-200';
    return 'from-red-50 to-red-100 border-red-200';
  };

  const getPriceBadgeColor = (price) => {
    if (price < 2000000) return 'bg-green-100 text-green-700';
    if (price < 5000000) return 'bg-blue-100 text-blue-700';
    if (price < 10000000) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="bg-white rounded-xl card-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Propiedades Disponibles</h2>
          <p className="text-sm text-gray-600 mt-1">{properties.length} propiedades encontradas</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-sm text-sm"
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No se encontraron propiedades con esos filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.isArray(properties) && properties.map((property, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${getPriceColor(property.price)} rounded-xl border p-5 card-shadow hover:shadow-lg transition-all cursor-pointer group`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                    {property.property_type}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded transition"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      isFavorite(property.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 group-hover:text-red-500'
                    }`}
                  />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 mb-2 text-lg truncate">{property.zone}</h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">Recámaras: {property.bedrooms}</p>

              <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-200 border-opacity-40">
                <div className="text-center">
                  <Bed className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 font-medium">{property.bedrooms}</p>
                </div>
                <div className="text-center">
                  <Maximize2 className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600 font-medium">{property.area_sqm?.toFixed(0) || 'N/A'} m2</p>
                </div>
                <div className="text-center">
                  {property.has_pool ? (
                    <div className="text-center">
                      <p className="text-xs text-blue-600 font-bold">Alberca</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600">-</p>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-2">Características</p>
                <div className="flex gap-2 flex-wrap">
                  {property.has_ocean_view && (
                    <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Vista al Mar</span>
                  )}
                  {property.has_pool && (
                    <span className="bg-cyan-200 text-cyan-800 text-xs px-2 py-1 rounded-full font-medium">Alberca</span>
                  )}
                  {!property.has_ocean_view && !property.has_pool && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">Estándar</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 border-opacity-40">
                <p className="text-xs text-gray-600 mb-1">Precio</p>
                <p className={`text-2xl font-bold ${getPriceBadgeColor(property.price).replace('bg-', 'text-')}`}>
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
