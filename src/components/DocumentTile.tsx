import { motion } from 'framer-motion';
import { 
  WifiHigh, 
  MicrosoftTeamsLogo, 
  EnvelopeSimple, 
  ShieldCheck, 
  Globe, 
  Printer, 
  Phone as PhoneIcon, 
  Laptop,
  CaretRight,
  File,
  Image as ImageIcon
} from '@phosphor-icons/react';
import { SupportDocument } from '@/lib/documents';

const iconMap = {
  wifi: WifiHigh,
  teams: MicrosoftTeamsLogo,
  email: EnvelopeSimple,
  security: ShieldCheck,
  vpn: Globe,
  printer: Printer,
  phone: PhoneIcon,
  laptop: Laptop,
  file: File,
  image: ImageIcon,
};

// Neo-Brutalist category styles with bold colors
const categoryStyles: Record<string, { bg: string; text: string; accent: string }> = {
  Network: { bg: 'bg-[#00FFFF]', text: 'text-black', accent: '#00FFFF' },
  Collaboration: { bg: 'bg-[#CCFF00]', text: 'text-black', accent: '#CCFF00' },
  Communication: { bg: 'bg-white', text: 'text-black', accent: '#FFFFFF' },
  Security: { bg: 'bg-[#FF3300]', text: 'text-white', accent: '#FF3300' },
  Hardware: { bg: 'bg-[#CCFF00]', text: 'text-black', accent: '#CCFF00' },
  General: { bg: 'bg-gray-200', text: 'text-black', accent: '#E5E5E5' },
};

interface DocumentTileProps {
  document: SupportDocument;
  onSelect: (doc: SupportDocument) => void;
}

export function DocumentTile({ document, onSelect }: DocumentTileProps) {
  const Icon = iconMap[document.icon];
  const style = categoryStyles[document.category] || { bg: 'bg-gray-200', text: 'text-black', accent: '#E5E5E5' };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={() => onSelect(document)}
      className="w-full flex items-center gap-4 p-4 bg-white border-3 border-black text-left group relative overflow-hidden hover:translate-x-[-3px] hover:translate-y-[-3px] transition-transform"
      style={{
        boxShadow: '4px 4px 0 #000',
      }}
    >
      {/* Geometric icon container with offset background */}
      <div className="relative shrink-0">
        <div 
          className={`absolute inset-0 translate-x-1 translate-y-1 ${style.bg}`}
          style={{ width: '48px', height: '48px' }}
        />
        <div className="relative w-12 h-12 bg-black border-2 border-black flex items-center justify-center z-10">
          <Icon className="w-6 h-6 text-[#CCFF00]" weight="bold" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 
          className="font-black text-sm text-black leading-tight uppercase tracking-tight mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {document.title}
        </h3>
        <div className="flex items-center gap-2">
          <span 
            className={`${style.bg} ${style.text} px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border border-black`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {document.category}
          </span>
          {document.type !== 'markdown' && (
            <span 
              className="bg-black text-[#CCFF00] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {document.type.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      
      {/* Arrow with brutalist styling */}
      <div className="shrink-0 w-8 h-8 bg-black border-2 border-black flex items-center justify-center group-hover:bg-[#CCFF00] transition-colors">
        <CaretRight className="w-5 h-5 text-[#CCFF00] group-hover:text-black transition-colors" weight="bold" />
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-transparent border-r-black opacity-20"></div>
    </motion.button>
  );
}
