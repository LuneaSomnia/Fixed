interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export async function initiateSTKPush(
  phoneNumber: string,
  amount: number,
  orderId: string
): Promise<{ success: boolean; checkoutRequestId?: string; error?: string }> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;
  const env = process.env.MPESA_ENV || 'sandbox';

  if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
    return { success: false, error: 'M-Pesa credentials not configured' };
  }

  try {
    // Generate access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenUrl = env === 'production' 
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    const tokenResponse = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return { success: false, error: 'Failed to get M-Pesa access token' };
    }

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    // STK Push request
    const stkUrl = env === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const stkResponse = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: `ORDER-${orderId}`,
        TransactionDesc: `SeasideSeafood Order ${orderId}`,
      }),
    });

    const stkData: STKPushResponse = await stkResponse.json();

    if (stkData.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestId: stkData.CheckoutRequestID,
      };
    } else {
      return {
        success: false,
        error: stkData.ResponseDescription || 'STK Push failed',
      };
    }
  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    return { success: false, error: 'Network error during payment initiation' };
  }
}