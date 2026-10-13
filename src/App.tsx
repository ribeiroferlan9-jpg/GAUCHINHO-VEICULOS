import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FilterState, Vehicle, VehicleCategory } from './types';
import { 
  SlidersHorizontal, 
  Car, 
  RotateCcw, 
  Sparkles, 
  ArrowUpDown, 
  CheckCircle2, 
  SearchX, 
  ShieldCheck, 
  Award, 
  Clock, 
  PhoneCall 
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  category: 'Todos',
  transmission: 'Todas',
  priceRange: 'all',
  sortBy: 'featured',
  onlyAvailable: false,
};

function CatalogApp() {
  const { vehicles, settings } = useCatalog();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Sync hash #admin for direct link
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    window.location.hash = 'admin';
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filtered & Sorted vehicles list
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        // Search by title, brand, model or version
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase().trim();
          const matchTitle = vehicle.title.toLowerCase().includes(query);
          const matchBrand = vehicle.brand.toLowerCase().includes(query);
          const matchModel = vehicle.model.toLowerCase().includes(query);
          const matchYear = `${vehicle.year}`.includes(query) || `${vehicle.modelYear}`.includes(query);
          if (!matchTitle && !matchBrand && !matchModel && !matchYear) return false;
        }

        // Category
        if (filters.category !== 'Todos' && vehicle.category !== filters.category) {
          return false;
        }

        // Transmission
        if (filters.transmission !== 'Todas' && vehicle.transmission !== filters.transmission) {
          return false;
        }

        // Price Range
        if (filters.priceRange === 'under100' && vehicle.price > 100000) return false;
        if (filters.priceRange === '100to150' && (vehicle.price < 100000 || vehicle.price > 150000)) return false;
        if (filters.priceRange === '150to200' && (vehicle.price < 150000 || vehicle.price > 200000)) return false;
        if (filters.priceRange === 'above200' && vehicle.price < 200000) return false;

        // Availability filter
        if (filters.onlyAvailable && vehicle.status !== 'disponivel') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sold cars move down slightly if sorting by featured
        if (filters.sortBy === 'featured') {
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          if (a.status !== b.status) {
            if (a.status === 'disponivel') return -1;
            if (b.status === 'disponivel') return 1;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return b.modelYear - a.modelYear;
        if (filters.sortBy === 'km-asc') return a.mileage - b.mileage;
        return 0;
      });
  }, [vehicles, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'Todos') count++;
    if (filters.transmission !== 'Todas') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.search) count++;
    if (filters.onlyAvailable) count++;
    return count;
  }, [filters]);

  const totalAvailableCount = useMemo(() => {
    return vehicles.filter((v) => v.status === 'disponivel').length;
  }, [vehicles]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0E] text-white selection:bg-red-600 selection:text-white">
      {/* 1. Glass Header Navigation */}
      <Header
        searchTerm={filters.search}
        onSearchChange={(val) => handleFilterUpdate({ search: val })}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 2. Hero Section with Atmosphere & Quick Filters */}
      <HeroSection
        filters={filters}
        onFilterChange={handleFilterUpdate}
        onScrollToCatalog={handleScrollToCatalog}
        totalAvailableCount={totalAvailableCount}
      />

      {/* 3. Main Catalog Section */}
      <section ref={catalogRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section Header & View Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Estoque Selecionado
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Exibindo <span className="text-white font-bold">{filteredVehicles.length}</span> de {vehicles.length} veículos cadastrados
            </p>
          </div>

          {/* Catalog Controls: Sort & Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Toggle Only Available */}
            <button
              onClick={() => handleFilterUpdate({ onlyAvailable: !filters.onlyAvailable })}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                filters.onlyAvailable
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${filters.onlyAvailable ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>Apenas Disponíveis</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterUpdate({ sortBy: e.target.value as any })}
                className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#121217] text-white">Destaques Primeiro</option>
                <option value="price-asc" className="bg-[#121217] text-white">Menor Preço</option>
                <option value="price-desc" className="bg-[#121217] text-white">Maior Preço</option>
                <option value="year-desc" className="bg-[#121217] text-white">Ano Mais Novo</option>
                <option value="km-asc" className="bg-[#121217] text-white">Menor Quilometragem</option>
              </select>
            </div>

            {/* Reset Filters (if any filter active) */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Limpar todos os filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Vehicle Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={setSelectedVehicle}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-20 text-center liquid-glass rounded-3xl border border-white/10 mt-8 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Nenhum veículo encontrado</h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Não encontramos nenhum carro correspondente aos filtros selecionados. Tente ajustar a busca ou o valor.
            </p>
            <button
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold text-white brand-gradient brand-glow inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver Todo o Catálogo</span>
            </button>
          </div>
        )}
      </section>

      {/* 4. Store Provenance Banner */}
      <section className="border-y border-white/10 bg-[#0E0E12] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl liquid-glass border border-white/5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Laudo Cautelar Aprovado</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Todos os veículos passam por perícia minuciosa de estrutura, procedência e histórico sem sinistro ou leilão.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl liquid-glass border border-white/5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Garantia e Revisão</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Entrega com revisão de componentes de segurança, higienização completa e garantia de 3 meses para motor e câmbio.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl liquid-glass border border-white/5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Aprovação Imediata</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Parceria com os principais bancos para simular e aprovar seu financiamento na hora via WhatsApp, com ou sem entrada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Footer */}
      <Footer />

      {/* 6. Quick View Vehicle Modal (Liquid Glass) */}
      <VehicleModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      {/* 7. Floating WhatsApp Conversion Button */}
      <FloatingWhatsApp />

      {/* 8. Admin / Owner Dashboard Panel */}
      {isAdminOpen && <AdminPanel onClose={handleCloseAdmin} />}
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider>
      <CatalogApp />
    </CatalogProvider>
  );
}
