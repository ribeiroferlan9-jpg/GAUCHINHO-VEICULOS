import React from 'react';
import { FilterState, VehicleCategory, TransmissionType } from '../types';
import { SlidersHorizontal, CheckCircle2, Shield, Sparkles, Car } from 'lucide-react';

interface HeroSectionProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onScrollToCatalog: () => void;
  totalAvailableCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  onFilterChange,
  onScrollToCatalog,
  totalAvailableCount,
}) => {
  const categories: { label: string; value: VehicleCategory }[] = [
    { label: 'Todos', value: 'Todos' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'Hatch', value: 'Hatch' },
    { label: 'Pickup', value: 'Pickup' },
    { label: 'Esportivo', value: 'Esportivo' },
  ];

  const priceRanges = [
    { label: 'Qualquer Preço', value: 'all' as const },
    { label: 'Até R$ 100 mil', value: 'under100' as const },
    { label: 'R$ 100k a 150k', value: '100to150' as const },
    { label: 'R$ 150k a 200k', value: '150to200' as const },
    { label: 'Acima de R$ 200 mil', value: 'above200' as const },
  ];

  const transmissions: { label: string; value: TransmissionType }[] = [
    { label: 'Câmbio: Todos', value: 'Todas' },
    { label: 'Automático', value: 'Automático' },
    { label: 'Manual', value: 'Manual' },
  ];

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background Radial Light Glows (Red & Soft Titanium) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-red-800/10 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          {/* Subtle brand kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-zinc-300 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>Showroom Digital Atualizado</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{totalAvailableCount} veículos disponíveis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Encontre seu próximo carro com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-400">
              garantia e procedência.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Carros seminovos revisados, periciados com laudo cautelar 100% aprovado e as melhores condições de financiamento do mercado sul-mato-grossense.
          </p>

          {/* Trust Guarantees */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
              <span>Laudo Cautelar Aprovado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Garantia de Motor & Câmbio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Troca com Troco & Financiamento Fácil</span>
            </div>
          </div>
        </div>

        {/* Liquid Glass Filter Box (iOS Glassmorphism) */}
        <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl liquid-glass border border-white/15 shadow-2xl relative">
          {/* Top Categories Segmented Control */}
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-red-500" />
              <span>Categoria do Veículo</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {categories.map((cat) => {
                const active = filters.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => onFilterChange({ category: cat.value })}
                    className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? 'brand-gradient text-white shadow-md shadow-red-950/50 border border-red-400/30'
                        : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white border border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dropdown Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            {/* Price Range Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Faixa de Preço
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  onFilterChange({
                    priceRange: e.target.value as FilterState['priceRange'],
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#121217] text-white rounded-xl border border-white/10 focus:border-red-500/60 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {priceRanges.map((p) => (
                  <option key={p.value} value={p.value} className="bg-[#121217] text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Câmbio / Transmissão
              </label>
              <select
                value={filters.transmission}
                onChange={(e) =>
                  onFilterChange({
                    transmission: e.target.value as TransmissionType,
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#121217] text-white rounded-xl border border-white/10 focus:border-red-500/60 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {transmissions.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#121217] text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit / Trigger Button */}
            <div className="flex items-end">
              <button
                onClick={onScrollToCatalog}
                className="w-full h-[40px] px-4 rounded-xl text-xs sm:text-sm font-bold text-white brand-gradient brand-glow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-red-400/30 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtrar Veículos</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
