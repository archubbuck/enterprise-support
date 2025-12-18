import { Phone, EnvelopeSimple, MapPin, Clock, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { contactInfo, ContactRegion } from '@/lib/documents';

function groupByRegion(regions: ContactRegion[]): Record<string, ContactRegion[]> {
  return regions.reduce((acc, contact) => {
    if (!acc[contact.region]) {
      acc[contact.region] = [];
    }
    acc[contact.region].push(contact);
    return acc;
  }, {} as Record<string, ContactRegion[]>);
}

export function ContactsView() {
  const groupedContacts = groupByRegion(contactInfo.regions);

  return (
    <div className="px-5 pb-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">IT Help Desk</h2>
        <p className="text-sm text-muted-foreground">
          Contact your regional support team
        </p>
      </div>

      <button
        onClick={() => window.location.href = `mailto:${contactInfo.email}`}
        className="w-full flex items-center gap-4 p-4 bg-accent/10 rounded-xl hover:bg-accent/15 transition-colors text-left group"
      >
        <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
          <EnvelopeSimple className="w-5 h-5 text-accent" weight="duotone" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">Global Email Support</p>
          <p className="text-sm font-medium text-foreground">{contactInfo.email}</p>
        </div>
        <CaretRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      </button>

      <div className="space-y-5">
        {Object.entries(groupedContacts).map(([region, contacts]) => (
          <div key={region}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              {region}
            </h3>
            
            <div className="space-y-2">
              {contacts.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = `tel:${contact.phone.replace(/\s/g, '')}`}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-muted/50 transition-colors text-left group"
                >
                  <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-foreground/70" weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{contact.city}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {contact.hours}
                      </span>
                    </div>
                  </div>
                  <CaretRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={() => window.location.href = `mailto:${contactInfo.emergencyEmail}`}
          className="w-full flex items-center gap-4 p-4 bg-destructive/10 rounded-xl hover:bg-destructive/15 transition-colors text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0">
            <EnvelopeSimple className="w-5 h-5 text-destructive" weight="duotone" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">Security Incidents</p>
            <p className="text-sm font-medium text-foreground">{contactInfo.emergencyEmail}</p>
          </div>
          <CaretRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </button>
        <p className="text-xs text-muted-foreground mt-2 px-1">
          Report security issues, suspicious emails, or lost devices
        </p>
      </div>
    </div>
  );
}
