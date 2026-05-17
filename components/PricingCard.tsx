import type { ReactNode } from 'react';

interface Feature {
  label: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: Feature[];
  featured?: boolean;
  badge?: string;
  customButton?: ReactNode;
}

export default function PricingCard({
  title,
  price,
  period = '/ мес',
  features,
  featured = false,
  badge,
  customButton,
}: PricingCardProps) {
  return (
    <div
      className={`relative group rounded-3xl p-8 flex flex-col overflow-hidden transition-all duration-300 ${
        featured
          ? 'border-2 border-purple-400 bg-gradient-to-br from-blue-600/20 to-purple-600/20 shadow-2xl shadow-purple-500/30 md:scale-105'
          : 'border border-blue-400/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10'
      }`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>

      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-bold shadow-lg z-20">
          {badge}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <h3 className={`text-2xl font-bold mb-2 transition-colors ${
          featured ? 'text-blue-300' : 'text-white'
        }`}>
          {title}
        </h3>

        {/* Price */}
        <div className="mb-6">
          <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${
            featured
              ? 'from-blue-400 to-purple-400'
              : 'from-blue-300 to-purple-300'
          } bg-clip-text text-transparent`}>
            {price}
          </div>
          {period && <p className="text-gray-400 text-sm">{period}</p>}
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8 flex-1">
          {features.map((f) => (
            <li key={f.label} className="flex items-start gap-3">
              <span className={`text-lg mt-0.5 flex-shrink-0 ${
                f.included ? 'text-blue-400' : 'text-gray-600'
              }`}>
                {f.included ? '✓' : '✗'}
              </span>
              <span className={`text-sm transition-colors ${
                f.included ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Button */}
        {customButton ?? (
          <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            featured
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
              : 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10'
          }`}>
            Выбрать план
          </button>
        )}
      </div>
    </div>
  );
}
