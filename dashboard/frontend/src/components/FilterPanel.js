import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, RotateCcw, Check } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function FilterPanel_v2({ filters, onFiltersChange }) {
  const [filterOptions, setFilterOptions] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);
  const [hasChanges, setHasChanges] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await apiService.getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    setHasChanges(true);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setHasChanges(false);
  };

  const handleReset = () => {
    const resetFilters = {
      zone: '',
      property_type: '',
      min_price: 0,
      max_price: 50000000,
      bedrooms: '',
      has_pool: '',
      has_ocean_view: '',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setHasChanges(false);
  };

  if (!filterOptions) {
    return <div className="text-gray-500">Cargando filtros...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-24 bg-white rounded-xl shadow-lg p-6 border border-gray-100 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto"
    >
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-500 rounded"></span>
          Filtros
        </h3>
      </div>

      {/* Zona */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Zona</label>
        <select
          value={localFilters.zone}
          onChange={(e) => handleFilterChange('zone', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 bg-white text-gray-800"
        >
          <option value="">Todas las zonas</option>
          {filterOptions.zones?.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de Propiedad */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
        <select
          value={localFilters.property_type}
          onChange={(e) => handleFilterChange('property_type', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 bg-white text-gray-800"
        >
          <option value="">Todos los tipos</option>
          {filterOptions.property_types?.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de Precio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">Rango de Precio</label>
        <div className="space-y-3">
          <div>
            <input
              type="range"
              min="0"
              max="50000000"
              value={localFilters.min_price}
              onChange={(e) => handleFilterChange('min_price', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              Mínimo: ${(localFilters.min_price / 1000000).toFixed(1)}M
            </p>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="50000000"
              value={localFilters.max_price}
              onChange={(e) => handleFilterChange('max_price', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              Máximo: ${(localFilters.max_price / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      {/* Recámaras */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Recámaras</label>
        <select
          value={localFilters.bedrooms}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 bg-white text-gray-800"
        >
          <option value="">Todas</option>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num} recámara{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Características */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Características</label>

        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
          <input
            type="checkbox"
            checked={localFilters.has_pool === true || localFilters.has_pool === 'true'}
            onChange={(e) =>
              handleFilterChange('has_pool', e.target.checked ? 'true' : '')
            }
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-gray-700 font-medium">Tiene Piscina</span>
        </label>

        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
          <input
            type="checkbox"
            checked={localFilters.has_ocean_view === true || localFilters.has_ocean_view === 'true'}
            onChange={(e) =>
              handleFilterChange('has_ocean_view', e.target.checked ? 'true' : '')
            }
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-gray-700 font-medium">Vista al Mar</span>
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          disabled={!hasChanges}
          className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
            hasChanges
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5" />
          Aplicar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50 transition"
        >
          <RotateCcw className="w-5 h-5" />
          Limpiar
        </motion.button>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 font-medium"
        >
          ℹ️ Tienes cambios sin aplicar
        </motion.div>
      )}
    </motion.div>
  );
}
