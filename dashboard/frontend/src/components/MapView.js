import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Map as MapIcon } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function MapView({ selectedZone }) {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, [selectedZone]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMapData(selectedZone);
      setMapData(response.data.markers || []);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceColor = (price) => {
    if (price < 2000000) return '#10b981'; // Emerald
    if (price < 5000000) return '#3b82f6'; // Blue
    if (price < 10000000) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Coordenadas centrales de Cancún
  const centerCoords = [21.1619, -86.8515];

  return (
    <div className="bg-white rounded-xl card-shadow p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <MapIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Mapa Interactivo de Cancún</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <MapContainer
              center={centerCoords}
              zoom={12}
              style={{ height: '500px', borderRadius: '12px', border: '2px solid #e5e7eb' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {mapData.map((property, idx) => (
                <CircleMarker
                  key={idx}
                  center={[property.latitude, property.longitude]}
                  radius={7}
                  fillColor={getPriceColor(property.price)}
                  color={getPriceColor(property.price)}
                  weight={2}
                  opacity={0.9}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">{property.property_type}</p>
                      <p className="text-gray-600">{property.bedrooms} recámaras</p>
                      <p className="text-blue-600 font-bold mt-1">{formatPrice(property.price)}</p>
                      <p className="text-xs text-gray-500 mt-1">{property.zone}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Leyenda mejorada */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#10b981', border: '2px solid #059669' }}></div>
              <span className="text-sm font-medium text-gray-700">Menos de $2M</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#3b82f6', border: '2px solid #1d4ed8' }}></div>
              <span className="text-sm font-medium text-gray-700">$2M - $5M</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#f59e0b', border: '2px solid #d97706' }}></div>
              <span className="text-sm font-medium text-gray-700">$5M - $10M</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#ef4444', border: '2px solid #dc2626' }}></div>
              <span className="text-sm font-medium text-gray-700">Más de $10M</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Total de propiedades mostradas: <span className="font-semibold text-gray-700">{mapData.length}</span>
          </p>
        </>
      )}
    </div>
  );
}
