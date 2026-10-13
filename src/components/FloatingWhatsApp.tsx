import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { getGeneralWhatsAppLink } = useCatalog();
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Tooltip Callout */}
      {!tooltipDismissed && (
        <div className="mb-2 relative bg-zinc-900/90 text-white text-xs px-3.5 py-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-medium">Vendedores online agora! Fale conosco</span>
          <button
            onClick={() => setTooltipDismissed(true)}
            className="text-zinc-400 hover:text-white ml-1 p-0.5"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Main Button */}
      <a
        href={getGeneralWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group p-3.5 sm:p-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl whatsapp-glow transition-transform duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
        aria-label="Abrir conversa no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        
        {/* Pulsating badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-[#0B0B0E] flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
        </span>
      </a>
    </div>
  );
};
