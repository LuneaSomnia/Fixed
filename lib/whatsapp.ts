export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const accessToken = process.env.WABA_ACCESS_TOKEN;
  const phoneNumberId = process.env.WABA_PHONE_NUMBER_ID;
  
  if (!accessToken || !phoneNumberId) {
    console.error('WhatsApp credentials not configured');
    return false;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body },
      }),
    });

    const result = await response.json();
    return response.ok;
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return false;
  }
}

export async function notifyOwnerNewOrder(summary: string): Promise<boolean> {
  const ownerNumber = process.env.WABA_OWNER_NUMBER;
  if (!ownerNumber) {
    console.error('Owner number not configured');
    return false;
  }

  const message = `🐟 NEW ORDER ALERT 🐟\n\n${summary}\n\nReply with:\n• YES <delivery_time> (e.g., "YES 30 mins")\n• NO (if out of stock)`;
  
  return await sendWhatsAppText(ownerNumber, message);
}

export function parseOwnerReply(message: string): { approved: boolean; eta?: string } {
  const msg = message.trim().toUpperCase();
  
  if (msg.startsWith('YES')) {
    const etaMatch = msg.match(/YES\s+(.+)/);
    return {
      approved: true,
      eta: etaMatch ? etaMatch[1] : '30-45 minutes',
    };
  }
  
  if (msg.startsWith('NO')) {
    return { approved: false };
  }
  
  return { approved: false };
}