/**
 * Server-side handler for CivicLens Image Analysis
 * Supports configurable AI providers: 'auto' | 'openrouter' | 'gemini'
 * Dual-compatible with standard Node.js HTTP servers and Vercel Serverless Functions.
 * Keeps API keys strictly on the server; never exposed to the client.
 */

export async function handleAnalyzeImage(req, res, serverConfig = {}) {
  // Extract server-side environment configurations
  const provider = (serverConfig.provider || process.env.AI_PROVIDER || 'auto').toLowerCase();
  const openRouterKey = (serverConfig.openRouterKey || process.env.OPENROUTER_API_KEY || '').trim();
  const geminiKey = (serverConfig.geminiKey || process.env.GEMINI_API_KEY || '').trim();
  const openRouterModel = serverConfig.openRouterModel || process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
  const geminiModel = serverConfig.geminiModel || process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  // Helper to send JSON response across Node HTTP and Vercel Serverless Function runtimes
  const sendJsonResponse = (statusCode, payload) => {
    if (typeof res.status === 'function') {
      res.status(statusCode).json(payload);
    } else {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
    }
  };

  // Only accept POST
  if (req.method !== 'POST') {
    sendJsonResponse(405, { ok: false, error: 'Method Not Allowed' });
    return;
  }

  // Parse body from stream or pre-parsed object
  const processPayload = async (body) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', categoryHint } = body || {};

      // 1. If no API keys are available, return fallback directive cleanly
      const hasOpenRouter = Boolean(openRouterKey && openRouterKey !== 'YOUR_OPENROUTER_API_KEY');
      const hasGemini = Boolean(geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY');

      if (!hasOpenRouter && !hasGemini) {
        sendJsonResponse(200, {
          ok: false,
          fallback: true,
          reason: 'NO_API_KEY',
          message: 'No AI API keys configured on server. Activating deterministic local fallback.'
        });
        return;
      }

      // 2. Validate image payload
      if (!imageBase64) {
        sendJsonResponse(400, { ok: false, error: 'Missing imageBase64 in request body' });
        return;
      }

      // Clean base64 data URL prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

      // 3. System instruction & prompt for civic infrastructure analysis
      const systemInstruction = `You are CivicLens AI, a specialized municipal infrastructure intelligence system.
Analyze the provided photograph of a public urban infrastructure issue (such as pavement void/pothole, water leak, storm drain blockage, damaged traffic signal, downed tree, or sidewalk buckling).

Return a strictly formatted JSON object with the following schema:
{
  "defectType": string (concise name of defect e.g. "Pavement Structural Void (Class 3)"),
  "category": string (one of: "Roadways & Pavement", "Water & Utilities", "Electrical & Signals", "Stormwater & Drainage", "Parks & Public Safety"),
  "title": string (concise civic ticket title, max 8 words),
  "description": string (concise objective description of observed damage, 1-2 sentences),
  "severity": string (one of: "Critical", "High", "Medium", "Low"),
  "urgencyScore": number (integer between 50 and 99 reflecting immediate civic risk),
  "department": string (recommended municipal department e.g. "Public Works & Transportation", "Water & Sewer Authority", "Traffic Operations & Electrical", "Sanitation & Drainage"),
  "reasoning": string (1-2 sentences explaining root-cause risk to public safety, traffic, or utility grid),
  "visualEstimateNote": string (explicitly labeled visual approximation of dimensions e.g. "Visual approximation: depth ~15-20cm, width ~1.2m. Requires field crew physical verification."),
  "suggestedAction": string (immediate recommended dispatch action e.g. "Deploy safety barricades and dispatch asphalt compaction unit"),
  "aiTags": array of strings (3-5 relevant classification tags)
}
Do NOT return Markdown backticks. Return valid JSON only.`;

      let parsedData = null;

      // 4. Try OpenRouter Provider if selected or auto
      const shouldUseOpenRouter = (provider === 'openrouter' || provider === 'auto') && hasOpenRouter;
      if (shouldUseOpenRouter) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

          const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://civiclens.vercel.app',
              'X-Title': 'CivicLens'
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: openRouterModel,
              max_tokens: 1000,
              response_format: { type: 'json_object' },
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: systemInstruction },
                    {
                      type: 'image_url',
                      image_url: {
                        url: `data:${mimeType};base64,${cleanBase64}`
                      }
                    }
                  ]
                }
              ],
              temperature: 0.2
            })
          });

          clearTimeout(timeoutId);

          if (openRouterResponse.ok) {
            const orJson = await openRouterResponse.json();
            const contentText = orJson.choices?.[0]?.message?.content;
            if (contentText) {
              const cleaned = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
              parsedData = JSON.parse(cleaned);
              parsedData.source = `openrouter:${openRouterModel}`;
            }
          } else {
            const errText = await openRouterResponse.text();
            console.warn('[CivicLens Server] OpenRouter API status:', openRouterResponse.status, errText);
          }
        } catch (orErr) {
          console.warn('[CivicLens Server] OpenRouter call exception:', orErr.message);
        }
      }

      // 5. Try Gemini Direct Provider if selected, or as fallback in auto mode
      const shouldUseGemini = (!parsedData && (provider === 'gemini' || provider === 'auto') && hasGemini);
      if (shouldUseGemini) {
        try {
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${encodeURIComponent(geminiKey)}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6500);

          const geminiResponse = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{
                role: 'user',
                parts: [
                  { text: systemInstruction },
                  { inline_data: { mime_type: mimeType, data: cleanBase64 } }
                ]
              }],
              generationConfig: { response_mime_type: 'application/json', temperature: 0.2 }
            })
          });
          clearTimeout(timeoutId);

          if (geminiResponse.ok) {
            const rawResult = await geminiResponse.json();
            const candidateText = rawResult.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              const cleanedText = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
              parsedData = JSON.parse(cleanedText);
              parsedData.source = `gemini:${geminiModel}`;
            }
          } else {
            const errorText = await geminiResponse.text();
            console.warn('[CivicLens Server] Gemini API status:', geminiResponse.status, errorText);
          }
        } catch (gErr) {
          console.warn('[CivicLens Server] Gemini direct exception:', gErr.message);
        }
      }

      // If live AI failed or was not configured, trigger deterministic fallback
      if (!parsedData) {
        sendJsonResponse(200, {
          ok: false,
          fallback: true,
          reason: 'API_ERROR',
          message: 'Live AI model returned no content. Activating deterministic local fallback.'
        });
        return;
      }

      // Ensure required keys exist with sensible fallbacks
      const sanitizedData = {
        defectType: parsedData.defectType || 'Infrastructure Defect',
        category: parsedData.category || categoryHint || 'Roadways & Pavement',
        title: parsedData.title || 'Civic Infrastructure Defect Detected',
        description: parsedData.description || 'Observed public infrastructure damage requiring inspection.',
        severity: ['Critical', 'High', 'Medium', 'Low'].includes(parsedData.severity) ? parsedData.severity : 'High',
        urgencyScore: typeof parsedData.urgencyScore === 'number' ? parsedData.urgencyScore : 85,
        department: parsedData.department || 'Public Works & Transportation',
        reasoning: parsedData.reasoning || 'Identified potential safety and transit disruption.',
        visualEstimateNote: parsedData.visualEstimateNote || 'Visual approximation only. Requires field crew physical verification.',
        suggestedAction: parsedData.suggestedAction || 'Deploy municipal inspection unit for on-site assessment.',
        aiTags: Array.isArray(parsedData.aiTags) ? parsedData.aiTags : ['Infrastructure', 'Defect', 'Inspection Needed'],
        source: parsedData.source || 'live-vision-model'
      };

      sendJsonResponse(200, {
        ok: true,
        data: sanitizedData
      });

    } catch (err) {
      console.warn('[CivicLens Server] Error processing image analysis:', err.message);
      sendJsonResponse(200, {
        ok: false,
        fallback: true,
        reason: 'EXCEPTION',
        message: err.message || 'Server exception during image analysis. Falling back to local model.'
      });
    }
  };

  // If req.body is already an object (e.g. Vercel Serverless Function)
  if (req.body && typeof req.body === 'object') {
    await processPayload(req.body);
    return;
  }

  // If req is a readable stream (e.g. Node standard http)
  let bodyStr = '';
  req.on('data', chunk => {
    bodyStr += chunk;
  });

  req.on('end', async () => {
    try {
      const parsedBody = JSON.parse(bodyStr || '{}');
      await processPayload(parsedBody);
    } catch (e) {
      await processPayload({});
    }
  });
}
