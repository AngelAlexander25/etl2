import axios from 'axios';

// Usar variable de entorno o default a localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Limpiar filtros vacíos antes de enviar
const cleanFilters = (filters = {}) => {
  const cleaned = {};
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    // No enviar strings vacíos, null, undefined
    if (value !== '' && value !== null && value !== undefined) {
      // Si es min_price y es 0, no lo enviar (usar default del backend)
      if (key === 'min_price' && value === 0) {
        return;
      }
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const apiService = {
  // KPIs y estadísticas
  getStats: (filters = {}) => api.get('/stats', { params: cleanFilters(filters) }),
  
  // Propiedades
  getProperties: (filters = {}) => api.get('/properties', { params: cleanFilters(filters) }),
  getPropertyDetail: (propertyId) => api.get(`/properties/${propertyId}`),
  
  // Mapa
  getMapData: (filters = {}) => api.get('/map-data', { params: cleanFilters(filters) }),
  
  // Zonas
  getZones: () => api.get('/zones'),
  
  // Tendencias
  getTrends: (filters = {}) => api.get('/trends', { params: cleanFilters(filters) }),
  
  // Comparación de precios
  getPriceComparison: () => api.get('/price-comparison'),
  
  // ROI
  calculateROI: (property_price, monthly_rent, annual_appreciation) => 
    api.get('/roi-calculator', { 
      params: { property_price, monthly_rent, annual_appreciation } 
    }),
  
  // Opciones de filtros
  getFilterOptions: () => api.get('/filters/options'),
};

export default api;
