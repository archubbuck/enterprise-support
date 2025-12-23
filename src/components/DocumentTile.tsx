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

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Network: { bg: 'bg-blue-50', text: 'text-blue-600' },
  Collaboration: { bg: 'bg-violet-50', text: 'text-violet-600' },
  Communication: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  Security: { bg: 'bg-rose-50', text: 'text-rose-600' },
  Hardware: { bg: 'bg-amber-50', text: 'text-amber-600' },
  General: { bg: 'bg-slate-50', text: 'text-slate-600' },
};

interface DocumentTileProps {
  document: SupportDocument;
  onSelect: (doc: SupportDocument) => void;
}

export function DocumentTile({ document, onSelect }: DocumentTileProps) {
  const Icon = iconMap[document.icon];
  const style = categoryStyles[document.category] || { bg: 'bg-muted', text: 'text-muted-foreground' };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={() => onSelect(document)}
      className="w-full flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-muted/50 transition-colors text-left group"
    >
      <div className={`w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${style.text}`} weight="duotone" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-foreground leading-snug">
          {document.title}
        </h3>
        <span className={`text-xs ${style.text} font-medium`}>
          {document.category}
        </span>
      </div>
      <CaretRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </motion.button>
  );
}
