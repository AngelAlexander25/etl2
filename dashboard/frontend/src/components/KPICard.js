import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Home, DollarSign, MapPin, Eye } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, trend, color = 'blue', unit = '' }) {
  const bgColors = {
    blue: 'from-blue-50 to-cyan-50',
    green: 'from-green-50 to-emerald-50',
    orange: 'from-orange-50 to-amber-50',
    purple: 'from-purple-50 to-pink-50',
    red: 'from-red-50 to-rose-50',
  };

  const iconBgColors = {
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600',
    orange: 'bg-gradient-to-br from-orange-500 to-amber-600',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-600',
    red: 'bg-gradient-to-br from-red-500 to-rose-600',
  };

  const borderColors = {
    blue: 'border-cyan-200',
    green: 'border-emerald-200',
    orange: 'border-amber-200',
    purple: 'border-pink-200',
    red: 'border-rose-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br ${bgColors[color]} border-2 ${borderColors[color]} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString('es-MX') : value}
            </h3>
            {unit && <span className="text-lg text-gray-500">{unit}</span>}
          </div>
        </div>
        <div className={`${iconBgColors[color]} p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          {trend > 0 ? (
            <>
              <div className="bg-green-100 rounded-full p-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-green-600 font-semibold text-sm">+{trend}%</span>
            </>
          ) : trend < 0 ? (
            <>
              <div className="bg-red-100 rounded-full p-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-red-600 font-semibold text-sm">{trend}%</span>
            </>
          ) : null}
          <span className="text-gray-500 text-xs ml-auto">vs. mes anterior</span>
        </div>
      )}
    </motion.div>
  );
}
