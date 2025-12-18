import { motion } from 'framer-motion';
import { 
  WifiHigh, 
  MicrosoftTeamsLogo, 
  EnvelopeSimple, 
  ShieldCheck, 
  Globe, 
  Printer, 
  Phone as PhoneIcon, 
  Laptop 
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
};

const categoryColors: Record<string, string> = {
  Network: 'bg-blue-100 text-blue-700',
  Collaboration: 'bg-purple-100 text-purple-700',
  Communication: 'bg-green-100 text-green-700',
  Security: 'bg-red-100 text-red-700',
  Hardware: 'bg-orange-100 text-orange-700',
};

interface DocumentTileProps {
  document: SupportDocument;
  onSelect: (doc: SupportDocument) => void;
}

export function DocumentTile({ document, onSelect }: DocumentTileProps) {
  const Icon = iconMap[document.icon];
  const categoryColor = categoryColors[document.category] || 'bg-muted text-muted-foreground';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card
        className="cursor-pointer p-4 h-full flex flex-col gap-3 border-border/50 shadow-sm hover:shadow-md hover:border-accent/30 transition-shadow"
        onClick={() => onSelect(document)}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" weight="duotone" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="font-medium text-sm leading-tight text-card-foreground line-clamp-2">
            {document.title}
          </h3>
          <Badge variant="secondary" className={`w-fit text-[10px] px-2 py-0.5 ${categoryColor}`}>
            {document.category}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}
