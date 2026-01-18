import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    property_price: 5000000,
    monthly_rent: 20000,
    annual_appreciation: 10,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key, value) => {
    setInputs({ ...inputs, [key]: parseFloat(value) });
  };

  const calculateROI = async () => {
    try {
      setLoading(true);
      const response = await apiService.calculateROI(
        inputs.property_price,
        inputs.monthly_rent,
        inputs.annual_appreciation
      );
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating ROI:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl card-shadow p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Calculadora de ROI</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="space-y-6 lg:col-span-1 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Parámetros de Inversión</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio de la Propiedad
            </label>
            <input
              type="number"
              value={inputs.property_price}
              onChange={(e) => handleInputChange('property_price', e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <p className="text-xs text-blue-700 mt-2 font-medium">{formatPrice(inputs.property_price)}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Renta Mensual Estimada
            </label>
            <input
              type="number"
              value={inputs.monthly_rent}
              onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <p className="text-xs text-blue-700 mt-2 font-medium">{formatPrice(inputs.monthly_rent)}/mes</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plusvalía Anual
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inputs.annual_appreciation}
                onChange={(e) => handleInputChange('annual_appreciation', e.target.value)}
                className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <span className="text-lg font-bold text-gray-700">%</span>
            </div>
          </div>

          <button
            onClick={calculateROI}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg"
          >
            {loading ? 'Calculando...' : 'Calcular ROI'}
          </button>
        </div>

        {/* Resultados */}
        {result && (
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Resultados del Análisis</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-5 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Renta Anual</p>
                <p className="text-3xl font-bold text-emerald-900 mt-3">
                  {formatPrice(result.annual_rent)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Yield de Renta</p>
                <p className="text-3xl font-bold text-blue-900 mt-3">
                  {result.rental_yield}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Ingreso Neto Anual</p>
                <p className="text-2xl font-bold text-purple-900 mt-3">
                  {formatPrice(result.net_annual_income)}
                </p>
                <p className="text-xs text-purple-600 mt-2 font-medium">(después de gastos 30%)</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-5 border border-orange-200">
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">ROI Total</p>
                <p className="text-3xl font-bold text-orange-900 mt-3">
                  {result.total_roi}%
                </p>
              </div>

              <div className="col-span-2 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-5 border border-red-200">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">Periodo de Recuperación</p>
                <p className="text-4xl font-bold text-red-900">
                  {result.payback_years} <span className="text-lg">años</span>
                </p>
                <p className="text-xs text-red-600 mt-2">Tiempo para recuperar tu inversión inicial</p>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <span className="font-bold">⚠️ Nota:</span> Este análisis es aproximado. No considera impuestos, mantenimiento, seguros, inflación, o variaciones del mercado.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
