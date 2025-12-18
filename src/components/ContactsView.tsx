import { Phone, EnvelopeSimple, Buildings, Clock, Globe } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    <div className="px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">IT Help Desk</h2>
        <p className="text-sm text-muted-foreground">
          Contact your regional IT support team for assistance.
        </p>
      </div>

      <Card className="p-4 space-y-3 border-accent/30 bg-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <EnvelopeSimple className="w-5 h-5 text-accent" weight="duotone" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Global Email Support</p>
            <p className="text-sm font-medium">{contactInfo.email}</p>
          </div>
        </div>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => window.location.href = `mailto:${contactInfo.email}`}
        >
          <EnvelopeSimple className="w-4 h-4 mr-2" />
          Send Email
        </Button>
      </Card>

      <Separator />

      <div className="space-y-5">
        {Object.entries(groupedContacts).map(([region, contacts]) => (
          <div key={region} className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" weight="bold" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                {region}
              </h3>
            </div>
            
            <div className="space-y-2">
              {contacts.map((contact, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Buildings className="w-5 h-5 text-primary" weight="duotone" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <p className="font-medium text-sm">{contact.city}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{contact.hours}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => window.location.href = `tel:${contact.phone.replace(/\s/g, '')}`}
                      >
                        <Phone className="w-4 h-4 mr-2" weight="duotone" />
                        {contact.phone}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <Card className="p-4 space-y-3 border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            <EnvelopeSimple className="w-5 h-5 text-destructive" weight="duotone" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Security Incidents</p>
            <p className="text-sm font-medium">{contactInfo.emergencyEmail}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Report security incidents, suspicious emails, or lost/stolen devices immediately.
        </p>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={() => window.location.href = `mailto:${contactInfo.emergencyEmail}`}
        >
          <EnvelopeSimple className="w-4 h-4 mr-2" />
          Report Security Issue
        </Button>
      </Card>
    </div>
  );
}
