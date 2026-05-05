import type { ReactNode } from "react";

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
  period = "/ мес",
  features,
  featured = false,
  badge,
  customButton,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-7 flex flex-col ${
        featured
          ? "border-2 border-violet-500 bg-zinc-900"
          : "border border-zinc-800 bg-zinc-900"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
          {badge}
        </span>
      )}

      <h3 className="text-xl font-bold text-white">{title}</h3>
      <div className="mt-3 mb-1">
        <span className="text-3xl font-bold text-white">{price}</span>
        {period && <span className="text-sm text-zinc-400 ml-1">{period}</span>}
      </div>

      <ul className="mt-5 mb-7 space-y-2 flex-1">
        {features.map((f) => (
          <li key={f.label} className="flex items-center gap-2 text-sm">
            <span
              className={`w-4 h-4 rounded-full flex-shrink-0 ${
                f.included ? "bg-violet-600" : "border border-zinc-700 bg-transparent"
              }`}
            />
            <span className={f.included ? "text-zinc-200" : "text-zinc-500"}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {customButton ?? (
        <button className={`w-full py-2.5 rounded-full text-sm font-semibold transition-colors border ${
          featured
            ? "bg-violet-600 hover:bg-violet-500 text-white border-violet-600"
            : "bg-transparent hover:bg-violet-600 hover:border-violet-600 text-violet-400 border-violet-500/50"
        }`}>
          Выбрать
        </button>
      )}
    </div>
  );
}
