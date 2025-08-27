export function formatKES(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

export function toIntlPhone(phone: string): string {
  // Remove any leading zeros and add 254 country code
  const cleaned = phone.replace(/^0+/, '');
  if (cleaned.startsWith('254')) {
    return cleaned;
  }
  return `254${cleaned}`;
}