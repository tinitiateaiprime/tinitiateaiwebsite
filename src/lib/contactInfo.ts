/** Contact details shown on the Contact and Request Callback pages. */
export const contact = {
  email: 'contact@tinitiateai.com',
  whatsapp: { label: '+91 6309123485', href: 'https://wa.me/916309123485' },
  phones: [
    { region: 'India', label: '+91 6309123485', href: 'tel:+916309123485' },
    { region: 'USA', label: '+1 (973) 653-6870', href: 'tel:+19736536870' },
    { region: 'USA', label: '+1 (206) 802-4102', href: 'tel:+12068024102' },
  ],
  offices: [
    {
      name: 'Corporate office', city: 'Hyderabad, India', address: 'Tinitiate AI, 3rd Floor, Prime Villa, 13-16, Road No. 1, Krishna Nagar, Dilsukhnagar, Hyderabad, Telangana 500060, India',
      mapUrl: 'https://maps.app.goo.gl/ivxjqrcRxnR4DSpg9',
      /** Pin on the building (Prime Villa, Dilsukhnagar). Needs no API key. */
      embedUrl: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s17.3652947,78.5294819!6i17',
    },
    { name: 'US office', city: 'Irving, Texas', address: '1420 Valley Trl, Irving, TX 75063, USA', mapUrl: undefined, embedUrl: undefined },
  ],
};

export const directions = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
