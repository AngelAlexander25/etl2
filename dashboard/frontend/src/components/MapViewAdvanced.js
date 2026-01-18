import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import 'leaflet/dist/leaflet.css';

// Crear icono de flecha/pin personalizado
const createArrowIcon = (price) => {
  // Determinar color basado en precio
  let color = '#10B981'; // Verde
  if (price >= 5000000 && price < 10000000) color = '#F59E0B'; // Ámbar
  else if (price >= 10000000) color = '#EF4444'; // Rojo
  else if (price >= 2000000 && price < 5000000) color = '#3B82F6'; // Azul

  // SVG de flecha/pin más simple y visible
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
      <path d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8z" 
            fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="8" r="3" fill="white" opacity="0.95"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32],
  });
};

// Componente para actualizar zoom cuando filtros cambian
function MapUpdater({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      const latitudes = bounds.map(p => p.latitude);
      const longitudes = bounds.map(p => p.longitude);
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      map.fitBounds([
        [minLat, minLng],
        [maxLat, maxLng],
      ], { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
}

export default function MapViewAdvanced_v2({ filters }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMapData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching map data with filters:', filters);
      const response = await apiService.getMapData(filters);
      console.log('Map data response:', response.data);
      // Asegurar que siempre sea un array
      const data = response.data;
      if (Array.isArray(data)) {
        setProperties(data);
        console.log('Set properties (array):', data.length, 'items');
      } else if (data && Array.isArray(data.properties)) {
        setProperties(data.properties);
        console.log('Set properties (object.properties):', data.properties.length, 'items');
      } else {
        setProperties([]);
        console.log('No valid properties data, set empty array');
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  // Coordenadas centro de Cancún
  const centerLat = 21.1633;
  const centerLng = -87.0432;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full rounded-xl overflow-hidden shadow-lg"
    >
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ width: '100%', height: '100%', minHeight: '600px' }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {Array.isArray(properties) && properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createArrowIcon(property.price)}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-xs">
                <h4 className="font-bold text-gray-800 mb-2">{property.property_type}</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Zona:</span> {property.zone}
                  </p>
                  <p>
                    <span className="font-semibold">Precio:</span>{' '}
                    <span className="text-blue-600 font-bold">
                      ${property.price.toLocaleString('es-MX')}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Recámaras:</span> {property.bedrooms}
                  </p>
                  <p>
                    <span className="font-semibold">Área:</span> {property.area_sqm} m²
                  </p>
                  {property.has_pool && (
                    <p className="text-green-600">✓ Tiene Piscina</p>
                  )}
                  {property.has_ocean_view && (
                    <p className="text-blue-600">✓ Vista al Mar</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapUpdater bounds={properties} />
      </MapContainer>

      {properties.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="text-gray-400 mb-2 text-5xl">🗺️</div>
            <p className="text-gray-600 font-medium">No hay propiedades para este filtro</p>
            <p className="text-gray-400 text-sm mt-1">Intenta cambiar los filtros</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
