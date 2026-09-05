// Central configuration for Foxeye Detective Agency website
window.agencyConfig = {
  defaultName: "FOX EYE INTERNATIONAL",
  defaultTagline: "INTELLIGENCE • SECURITY • CONFIDENTIAL RESOLUTION",

  contact: {
    phonePrimary: "(+91) 9539 39 3322",
    phoneSecondary: "(+91) 7994 106 707",
    whatsapp: "(+91) 9539 39 3322",
    whatsappLink: "https://wa.me/+919539393322",
    email: "foxeyeinternational@gmail.com",
    address: "TC 10/1194 THRIKKADAVOOR, KOLLAM ,KERALA PIN:6916012nd Floor, Ernakulam North, Kochi, Kerala - 682018"
  },

  services: [
    {
      id: "personal",
      title: "Personal Investigations",
      shortDesc: "Discreet investigative support for sensitive personal, matrimonial, and civil matters.",
      icon: "eye",
      subservices: [
        { name: "Pre-Matrimonial Investigation", desc: "Confidential verification of personal background, employment, lifestyle, social reputation, and other relevant details before marriage." },
        { name: "Post-Matrimonial Investigation", desc: "Discreet investigation of concerns arising after marriage, including behavioural and factual verification." },
        { name: "Divorce Case Investigation", desc: "Evidence-oriented investigative assistance for matrimonial disputes and divorce-related matters." },
        { name: "Personal Background Verification", desc: "Verification of an individual's identity, history, employment, and available background information." },
        { name: "Social & Civil Investigations", desc: "Fact-finding and information gathering relating to private, social, and civil concerns." },
        { name: "Customized Personal Investigation", desc: "Tailored investigative services based on the specific circumstances and information requirements of the client." }
      ]
    },
    {
      id: "corporate",
      title: "Corporate Intelligence",
      shortDesc: "Professional intelligence and verification services supporting businesses, employers, and corporate decision-making.",
      icon: "briefcase",
      subservices: [
        { name: "Employee Screening", desc: "Background verification and screening of prospective or existing employees." },
        { name: "Corporate Background Profiling", desc: "Investigation and verification of individuals or entities connected with business operations." },
        { name: "Asset Verification", desc: "Investigative verification of identifiable assets and relevant ownership information through lawful sources." },
        { name: "Trademark Infringement Investigation", desc: "Information gathering and field investigation relating to suspected trademark misuse or infringement." },
        { name: "Business Intelligence Investigation", desc: "Collection and verification of relevant business information for informed corporate decisions." },
        { name: "Internal Corporate Investigation", desc: "Confidential fact-finding relating to suspected misconduct, irregularities, or internal concerns." },
        { name: "Customized Corporate Intelligence", desc: "Investigation plans designed around specific organizational requirements." }
      ]
    },
    {
      id: "cyber",
      title: "Cyber & Digital Forensics",
      shortDesc: "Digital investigation and evidence support focused on identifying, preserving, and analysing relevant electronic information.",
      icon: "cpu",
      subservices: [
        { name: "Digital Evidence Investigation", desc: "Examination and documentation of available digital information relevant to an investigation." },
        { name: "Cyber Investigation Support", desc: "Investigative assistance for suspected online misconduct and digital incidents." },
        { name: "Online Identity & Profile Verification", desc: "Verification and correlation of publicly or lawfully available online information." },
        { name: "Digital Footprint Analysis", desc: "Investigation of relevant online presence and digital activity using lawful investigative methods." },
        { name: "Electronic Evidence Documentation", desc: "Structured preservation and reporting of digital findings for further professional or legal review." },
        { name: "Customized Digital Investigation", desc: "Case-specific digital investigation based on the client's requirements." }
      ]
    },
    {
      id: "legal",
      title: "Legal & Insurance Audits",
      shortDesc: "Evidence-focused investigations and verification services supporting legal, civil, and insurance-related matters.",
      icon: "shield",
      subservices: [
        { name: "Insurance Claim Investigation", desc: "Independent fact verification and investigative support relating to insurance claims." },
        { name: "Legal Evidence Support", desc: "Collection and documentation of relevant factual information for professional legal review." },
        { name: "Civil Case Investigation", desc: "Investigative assistance involving civil disputes and related fact-finding." },
        { name: "Criminal Matter Investigation Support", desc: "Lawful information gathering and investigative assistance concerning criminal matters without mimicking law enforcement." },
        { name: "Asset Verification & Documentation", desc: "Verification and reporting of relevant asset information." },
        { name: "Field Verification", desc: "Physical and factual verification of locations, entities, or case-related information." },
        { name: "Customized Investigation & Audit", desc: "Investigation services adapted to specific legal, insurance, or verification requirements." }
      ]
    },
    {
      id: "security",
      title: "Security, Protection & Commando Services",
      shortDesc: "Specialized security and protective services delivered for personal, corporate, and high-risk operational requirements.",
      icon: "lock",
      subservices: [
        { name: "Commando Services", desc: "Deployment of trained personnel for specialized security and high-risk protective assignments." },
        { name: "Personal Protection Services", desc: "Dedicated protective support for individuals based on assessed security requirements." },
        { name: "Executive Protection", desc: "Discreet security arrangements for executives, business leaders, and other clients requiring enhanced protection." },
        { name: "Corporate Security Services", desc: "Professional security support for offices, organizations, and corporate operations." },
        { name: "Specialized Protective Operations", desc: "Planned security deployments for sensitive or elevated-risk requirements." },
        { name: "Event & Operational Security", desc: "Security personnel and protective planning for events and specific operations." }
      ]
    }
  ],

  // Initial images for the slideshow
  banners: [
    {
      src: "assets/city_intel.jpg",
      title: "Vigilant Analytics",
      subtitle: "Overlooking details that others miss, under any conditions."
    },
    {
      src: "assets/surveillance_hub.jpg",
      title: "Cyber Surveillance",
      subtitle: "Securing operations through high-tech digital intelligence feeds."
    },
    {
      src: "assets/alleyway_noir.jpg",
      title: "Confidential Groundwork",
      subtitle: "Discreet physical tracking and fieldwork directly on the ground."
    }
  ]
};
