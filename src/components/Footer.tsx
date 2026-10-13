import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { BrandLogo } from './BrandLogo';
import { MapPin, Clock, Phone, Mail, MessageCircle, Instagram, Facebook, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, getGeneralWhatsAppLink } = useCatalog();

  return (
    <footer className="w-full border-t border-white/10 bg-[#07070A] pt-14 pb-8 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tradição, transparência e paixão por carros no Mato Grosso do Sul. Todos os veículos 100% periciados e com procedência comprovada.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors border border-white/5"
                title="Siga no Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://facebook.com/${settings.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors border border-white/5"
                title="Curta no Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-950/40 text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/20"
                title="Atendimento no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Endereço & Localização */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Onde Estamos
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-300">{settings.address}</p>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 underline font-medium mt-1 inline-block"
                >
                  Abrir no Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Horários & Contato */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Atendimento
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-zinc-300">{settings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-zinc-300">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-zinc-300">{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Garantias & Conversão */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Dúvidas ou Propostas?
            </h4>
            <p className="text-xs text-zinc-400">
              Fale agora com nosso time de consultores pelo WhatsApp e receba a avaliação do seu usado na hora.
            </p>
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] whatsapp-glow transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>
            &copy; {new Date().getFullYear()} Gauchinho Veículos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Site 100% Seguro • Carros Seminovos de Alta Procedência</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
