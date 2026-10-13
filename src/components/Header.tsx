import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { useCatalog } from '../context/CatalogContext';
import { Search, MessageCircle, ShieldCheck, PhoneCall, X } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenAdmin,
}) => {
  const { getGeneralWhatsAppLink, settings } = useCatalog();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full liquid-glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
        </div>

        {/* Minimalist Glass Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por modelo, marca ou ano..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] text-white placeholder-zinc-400 rounded-xl border border-white/10 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all backdrop-blur-md shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Abrir busca"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Admin / Painel Lojista Shortcut */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all"
            title="Painel Administrativo da Loja"
          >
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Área do Lojista</span>
          </button>

          {/* Main CTA: Falar com Vendedor (Red Gradient with WhatsApp icon) */}
          <a
            href={getGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white brand-gradient brand-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-red-400/30"
          >
            <MessageCircle className="w-4 h-4 fill-white/20 text-white" />
            <span>Falar com Vendedor</span>
          </a>
        </div>
      </div>

      {/* Expandable Mobile Search */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-4 pt-1 border-t border-white/5 bg-[#0B0B0E]/95 backdrop-blur-xl">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por modelo, marca ou ano..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white/[0.06] text-white placeholder-zinc-400 rounded-xl border border-white/10 focus:border-red-500 focus:outline-none"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
