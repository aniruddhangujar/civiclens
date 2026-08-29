export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      res.status(204).end();
    } else {
      res.statusCode = 204;
      res.end();
    }
    return;
  }

  const payload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CivicLens Vercel Serverless Platform',
    provider: process.env.AI_PROVIDER || 'auto',
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY)
  };

  if (typeof res.status === 'function') {
    res.status(200).json(payload);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  }
}
