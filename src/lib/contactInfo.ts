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
    { name: 'Corporate office', city: 'Hyderabad, India', address: '1-2/10 SBH Colony, Mohan Nagar, Kothapet, Telangana 500036, India' },
    { name: 'US office', city: 'Irving, Texas', address: '1420 Valley Trl, Irving, TX 75063, USA' },
  ],
};

export const directions = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
