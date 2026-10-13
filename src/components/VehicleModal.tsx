import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { useCatalog } from '../context/CatalogContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Calculator, 
  Check, 
  Calendar, 
  Gauge, 
  Cog, 
  Fuel, 
  Palette, 
  Tag, 
  ShieldCheck, 
  Share2, 
  CheckCircle2 
} from 'lucide-react';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose }) => {
  const { getWhatsAppLink, getFinancingWhatsAppLink, settings } = useCatalog();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'financing'>('details');
  const [copiedLink, setCopiedLink] = useState(false);

  // Financing Simulator state
  const defaultDownPayment = vehicle ? Math.round(vehicle.price * 0.3) : 30000;
  const [downPayment, setDownPayment] = useState<number>(defaultDownPayment);
  const [terms, setTerms] = useState<number>(48);

  useEffect(() => {
    if (vehicle) {
      setActiveImageIndex(0);
      setDownPayment(Math.round(vehicle.price * 0.3));
      setActiveTab('details');
    }
  }, [vehicle]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!vehicle) return null;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedKm = new Intl.NumberFormat('pt-BR').format(vehicle.mileage);

  // Financing calculation (approximate monthly interest rate 1.49% a.m.)
  const financedAmount = Math.max(0, vehicle.price - downPayment);
  const monthlyRate = 0.0149;
  const monthlyInstallment = financedAmount > 0
    ? Math.round(
        (financedAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -terms))
      )
    : 0;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isSold = vehicle.status === 'vendido';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container in Liquid Glass Style */}
      <div className="relative w-full max-w-4xl liquid-glass-modal rounded-3xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {vehicle.brand} • {vehicle.category}
            </span>
            {vehicle.featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Destaque
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Copiar link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {vehicle.title}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                {vehicle.version || `${vehicle.brand} ${vehicle.model}`}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs uppercase font-bold tracking-wider text-zinc-400 block">
                Valor à Vista
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Interactive Photo Gallery with Carousel & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 group">
              <img
                src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                alt={`${vehicle.title} foto ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Navigation Arrows (if multiple photos) */}
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Index Badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/70 text-zinc-200 border border-white/10 backdrop-blur-sm">
                {activeImageIndex + 1} / {vehicle.images.length}
              </div>
            </div>

            {/* Thumbnails row */}
            {vehicle.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'border-red-500 scale-105 shadow-md shadow-red-950/50'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tab Selector: Detalhes & Opcionais vs. Simulador de Financiamento */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-4 text-sm font-bold transition-all relative ${
                activeTab === 'details'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ficha & Opcionais
              {activeTab === 'details' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('financing')}
              className={`pb-3 px-4 text-sm font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'financing'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Calculator className="w-4 h-4 text-red-500" />
              <span>Simular Financiamento</span>
              {activeTab === 'financing' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          </div>

          {/* TAB 1: Details & Optionals */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Technical Specifications Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Especificações do Veículo
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Ano / Modelo</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">{vehicle.year} / {vehicle.modelYear}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <Gauge className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Quilometragem</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">{formattedKm} km</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <Cog className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Câmbio</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">{vehicle.transmission}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <Fuel className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Combustível</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <Palette className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Cor</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">{vehicle.color}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <Tag className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Final de Placa</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">Final {vehicle.plateEnd}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Sobre o Veículo
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Equipment / Optionals Checklist */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Itens de Série & Opcionais ({vehicle.features.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-200"
                      >
                        <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Store Guarantees */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Garantia & Procedência Gauchinho Veículos</span>
                  <span className="text-zinc-400">
                    Todos os nossos carros seminovos contam com laudo cautelar 100% aprovado, histórico veicular checado e garantia de motor e caixa. Aceitamos seu usado na troca com a melhor avaliação do mercado sul-mato-grossense.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Financing Simulator */}
          {activeTab === 'financing' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-red-500" />
                    <span>Simule o Financiamento</span>
                  </h4>
                  <span className="text-xs text-zinc-400">Taxas a partir de 1,49% a.m.</span>
                </div>

                {/* Down Payment Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-zinc-400 font-medium">Valor da Entrada:</span>
                    <span className="font-bold text-white text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(downPayment)}
                      <span className="text-zinc-400 font-normal ml-1">
                        ({Math.round((downPayment / vehicle.price) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.round(vehicle.price * 0.8)}
                    step={1000}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                    <span>Sem entrada (R$ 0)</span>
                    <span>Máx sugerido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(vehicle.price * 0.8)}</span>
                  </div>
                </div>

                {/* Installment Term Selector (Buttons) */}
                <div>
                  <span className="block text-xs font-medium text-zinc-400 mb-2">
                    Prazo de Financiamento:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[24, 36, 48, 60].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTerms(t)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          terms === t
                            ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/50'
                            : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        {t}x Meses
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculated Result Display */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block uppercase font-bold tracking-wider">
                      Parcela Estimada ({terms}x)
                    </span>
                    <span className="text-2xl font-black text-emerald-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(monthlyInstallment)}
                      <span className="text-xs text-zinc-400 font-normal ml-1">/mês</span>
                    </span>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    <div>Saldo Financiado:</div>
                    <div className="font-semibold text-zinc-200">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(financedAmount)}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-normal">
                  * Valores aproximados sujeitos à análise de crédito junto às instituições financeiras parceiras (BV Financeira, Santander, Itaú, Bradesco e Safra).
                </p>

                {/* Direct Send Financing to WhatsApp */}
                <a
                  href={getFinancingWhatsAppLink(
                    vehicle.title,
                    vehicle.price,
                    downPayment,
                    terms,
                    monthlyInstallment
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] whatsapp-glow transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>Enviar Simulação para o WhatsApp do Vendedor</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0B0B0E]/95 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-xs text-zinc-400 block">Dúvidas sobre este modelo?</span>
            <span className="text-sm font-bold text-white">Fale direto com a equipe de vendas</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isSold ? (
              <button
                disabled
                className="w-full sm:w-auto py-3 px-6 rounded-xl text-sm font-bold bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed"
              >
                Veículo Vendido
              </button>
            ) : (
              <a
                href={getWhatsAppLink(vehicle.title, vehicle.price)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-6 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] whatsapp-glow transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Tenho Interesse / WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
