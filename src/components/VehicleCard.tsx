import React from 'react';
import { Vehicle } from '../types';
import { useCatalog } from '../context/CatalogContext';
import { Calendar, Gauge, Cog, Fuel, MessageCircle, Eye, Star, CheckCircle2 } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const { getWhatsAppLink } = useCatalog();

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedKm = new Intl.NumberFormat('pt-BR').format(vehicle.mileage);

  const isSold = vehicle.status === 'vendido';
  const isReserved = vehicle.status === 'reservado';

  return (
    <div className={`group relative rounded-2xl overflow-hidden liquid-glass-card flex flex-col h-full ${
      isSold ? 'opacity-75 grayscale-[25%]' : ''
    }`}>
      {/* Top Image Container */}
      <div 
        className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-900 cursor-pointer"
        onClick={() => onSelect(vehicle)}
      >
        <img
          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop'}
          alt={vehicle.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E]/90 via-transparent to-black/30 pointer-events-none" />

        {/* Status / Feature Tags Top Left & Right */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Status Label */}
          {isSold ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-zinc-900/90 text-zinc-300 border border-zinc-700 backdrop-blur-md">
              Vendido
            </span>
          ) : isReserved ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-amber-500/80 text-black border border-amber-300/40 backdrop-blur-md">
              Reservado
            </span>
          ) : vehicle.isNewArrival ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-red-600/90 text-white border border-red-400/40 backdrop-blur-md shadow-lg shadow-red-950/50">
              Lançamento
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Disponível
            </span>
          )}

          {/* Featured / Category indicator */}
          <div className="flex items-center gap-1.5">
            {vehicle.featured && (
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-md" title="Veículo em Destaque">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-md">
              {vehicle.category}
            </span>
          </div>
        </div>

        {/* Image count preview badge */}
        {vehicle.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-sm">
            {vehicle.images.length} fotos
          </div>
        )}
      </div>

      {/* Vehicle Info Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model Title */}
          <h3 
            onClick={() => onSelect(vehicle)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
            title={vehicle.title}
          >
            {vehicle.title}
          </h3>

          <p className="text-xs text-zinc-400 font-normal mt-0.5 mb-3 line-clamp-1">
            {vehicle.version || `${vehicle.brand} ${vehicle.model}`}
          </p>

          {/* Quick Technical Specs Grid (4 icons: Ano, KM, Câmbio, Combustível) */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/[0.07] text-xs text-zinc-300">
            {/* Ano / Modelo */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{vehicle.year}/{vehicle.modelYear}</span>
            </div>

            {/* Quilometragem */}
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{formattedKm} km</span>
            </div>

            {/* Transmissão */}
            <div className="flex items-center gap-2">
              <Cog className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>

            {/* Combustível */}
            <div className="flex items-center gap-2">
              <Fuel className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{vehicle.fuel}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Call to Action */}
        <div className="mt-4 pt-1">
          {/* Highlighted Price */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                Valor à vista
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {formattedPrice}
              </span>
            </div>

            {/* Quick Details Eye Button */}
            <button
              onClick={() => onSelect(vehicle)}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Ver detalhes do veículo"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Conversion Action Button */}
          {isSold ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Veículo Indisponível (Vendido)</span>
            </button>
          ) : (
            <a
              href={getWhatsAppLink(vehicle.title, vehicle.price)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] whatsapp-glow transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Tenho Interesse / WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
