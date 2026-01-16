import { Phone, EnvelopeSimple, MapPin, Clock, CaretRight } from '@phosphor-icons/react';
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
    <div className="px-5 py-6 space-y-6">
      {/* Header with brutalist styling */}
      <div className="border-4 border-black p-4 bg-white" style={{ boxShadow: '6px 6px 0 #000' }}>
        <h2 
          className="text-lg font-black text-black uppercase tracking-tighter mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          IT HELP DESK
        </h2>
        <p 
          className="text-xs text-gray-600 uppercase tracking-wide"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          CONTACT YOUR REGIONAL SUPPORT TEAM
        </p>
      </div>

      {/* Global email with lime accent */}
      <button
        onClick={() => window.location.href = `mailto:${contactInfo.email}`}
        className="w-full flex items-center gap-4 p-5 bg-[#CCFF00] border-3 border-black text-left group hover:translate-x-[-3px] hover:translate-y-[-3px] transition-transform relative"
        style={{ boxShadow: '5px 5px 0 #000' }}
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black" style={{ width: '52px', height: '52px' }} />
          <div className="relative w-13 h-13 bg-black border-2 border-black flex items-center justify-center z-10">
            <EnvelopeSimple className="w-7 h-7 text-[#CCFF00]" weight="bold" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p 
            className="text-[9px] text-black mb-1 font-black uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            GLOBAL EMAIL SUPPORT
          </p>
          <p 
            className="text-sm font-black text-black"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {contactInfo.email}
          </p>
        </div>
        <div className="shrink-0 w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
          <CaretRight className="w-6 h-6 text-[#CCFF00]" weight="bold" />
        </div>
      </button>

      {/* Regional contacts */}
      <div className="space-y-6">
        {Object.entries(groupedContacts).map(([region, contacts]) => (
          <div key={region}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 flex-1 bg-black"></div>
              <h3 
                className="text-[10px] font-black text-black uppercase tracking-widest px-2 bg-white"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {region}
              </h3>
              <div className="h-1 flex-1 bg-black"></div>
            </div>
            
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = `tel:${contact.phone.replace(/\s/g, '')}`}
                  className="w-full flex items-center gap-4 p-4 bg-white border-3 border-black text-left group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                  style={{ boxShadow: '4px 4px 0 #000' }}
                >
                  <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#00FFFF]" weight="bold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-sm font-black text-black uppercase"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {contact.city}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span 
                        className="flex items-center gap-1 text-[10px] text-gray-600 font-bold uppercase"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <Phone className="w-3 h-3" weight="bold" />
                        {contact.phone}
                      </span>
                      <span 
                        className="flex items-center gap-1 text-[10px] text-gray-600 font-bold uppercase"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <Clock className="w-3 h-3" weight="bold" />
                        {contact.hours}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 w-8 h-8 bg-black border-2 border-black flex items-center justify-center">
                    <CaretRight className="w-5 h-5 text-[#CCFF00]" weight="bold" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency contact with red accent */}
      <div className="pt-2">
        <button
          onClick={() => window.location.href = `mailto:${contactInfo.emergencyEmail}`}
          className="w-full flex items-center gap-4 p-5 bg-[#FF3300] border-3 border-black text-left group hover:translate-x-[-3px] hover:translate-y-[-3px] transition-transform relative"
          style={{ boxShadow: '5px 5px 0 #000' }}
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black" style={{ width: '52px', height: '52px' }} />
            <div className="relative w-13 h-13 bg-black border-2 border-black flex items-center justify-center z-10 animate-pulse">
              <EnvelopeSimple className="w-7 h-7 text-[#FF3300]" weight="bold" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p 
              className="text-[9px] text-white mb-1 font-black uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              ⚠ SECURITY INCIDENTS
            </p>
            <p 
              className="text-sm font-black text-white"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {contactInfo.emergencyEmail}
            </p>
          </div>
          <div className="shrink-0 w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
            <CaretRight className="w-6 h-6 text-white" weight="bold" />
          </div>
        </button>
        <div 
          className="mt-3 px-4 py-2 bg-white border-2 border-black"
          style={{ boxShadow: '3px 3px 0 #000' }}
        >
          <p 
            className="text-[10px] text-gray-600 font-bold uppercase tracking-wide"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            REPORT: SECURITY ISSUES / SUSPICIOUS EMAILS / LOST DEVICES
          </p>
        </div>
      </div>
    </div>
  );
}
