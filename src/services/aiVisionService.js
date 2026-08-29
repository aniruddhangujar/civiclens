/**
 * Client-Side AI Vision Service
 * Communicates with server boundary /api/analyze-image with automatic graceful fallback
 */

export async function analyzeInfrastructurePhoto(imageSrc, fallbackPreset, categoryHint = 'Roadways & Pavement') {
  try {
    let base64Data = '';
    let mimeType = 'image/jpeg';

    if (imageSrc.startsWith('data:')) {
      const parts = imageSrc.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      base64Data = parts[1];
    } else {
      // For remote preset URLs, fetch and convert to blob -> base64
      try {
        const imgRes = await fetch(imageSrc, { mode: 'cors' });
        if (imgRes.ok) {
          const blob = await imgRes.blob();
          mimeType = blob.type || 'image/jpeg';
          base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result;
              resolve(res.split(',')[1] || '');
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      } catch (corsOrFetchErr) {
        console.info('[CivicLens Client] Remote image conversion skipped, using fallback preset:', corsOrFetchErr.message);
      }
    }

    // If we have base64 data, call server endpoint
    if (base64Data) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mimeType,
          categoryHint: categoryHint
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.ok && result.data) {
          const source = result.data.source || 'live-vision-model';
          return {
            ...result.data,
            isLiveAi: true,
            source,
            // Preserve bounding boxes from preset or generate normalized HUD coordinates
            boundingBoxes: fallbackPreset?.aiAnalysis?.boundingBoxes || [
              { label: result.data.defectType, top: "35%", left: "30%", width: "40%", height: "35%", color: result.data.severity === 'Critical' ? '#da1e28' : '#ff832b' }
            ]
          };
        }
      }
    }
  } catch (err) {
    console.info('[CivicLens Client] Vision API unreachable or timed out. Activating deterministic local fallback:', err.message);
  }

  // Graceful deterministic fallback
  const fallback = fallbackPreset?.aiAnalysis || {
    defectType: "Pavement Structural Void (Class 3)",
    category: "Roadways & Pavement",
    title: "Deep Pothole with Active Subsurface Water Flow",
    description: "Rapidly expanding roadbed void with water bubbling up from subterranean fracture.",
    severity: "Critical",
    urgencyScore: 94,
    department: "Public Works & Transportation",
    reasoning: "Correlated water washout causing rapid asphalt sub-base subsidence.",
    visualEstimateNote: "Visual approximation only (~18cm depth). Requires field crew physical verification.",
    suggestedAction: "Immediate emergency traffic coning + multi-agency dispatch",
    aiTags: ["Structural Void", "Hydro-erosion", "Roadway Defect"],
    boundingBoxes: fallbackPreset?.aiAnalysis?.boundingBoxes || []
  };

  return {
    ...fallback,
    isLiveAi: false,
    source: 'deterministic-local-model'
  };
}
