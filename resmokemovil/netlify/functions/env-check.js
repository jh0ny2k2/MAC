// Lightweight diagnostic function to verify required env vars presence and modes
// Returns only booleans and mode hints, never actual secret values

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-store'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' })
    };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
  const stripePublishable = process.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const stripePriceIdPremium = process.env.VITE_STRIPE_PRICE_ID_PREMIUM || process.env.STRIPE_PRICE_ID_PREMIUM || '';

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const inferMode = (key, livePrefix, testPrefix) => {
    if (!key) return null;
    if (key.startsWith(livePrefix)) return 'live';
    if (key.startsWith(testPrefix)) return 'test';
    return 'unknown';
  };

  const response = {
    ok: true,
    env: {
      stripe: {
        hasSecret: Boolean(stripeSecret),
        secretMode: inferMode(stripeSecret, 'sk_live', 'sk_test'),
        hasPublishable: Boolean(stripePublishable),
        publishableMode: inferMode(stripePublishable, 'pk_live', 'pk_test'),
        hasWebhookSecret: Boolean(stripeWebhookSecret),
        hasPriceIdPremium: Boolean(stripePriceIdPremium)
      },
      supabase: {
        hasUrl: Boolean(supabaseUrl),
        hasServiceRoleKey: Boolean(supabaseServiceRoleKey)
      }
    },
    note: 'This endpoint reports presence/mode only; no secret values are exposed.'
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response)
  };
};