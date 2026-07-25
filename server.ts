import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI ElectraCoach Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, context, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are ElectraCoach AI ⚡, Pakistan's leading smart energy saving assistant and electrical advisor.
You specialize in Pakistani power distribution companies (DISCOs: LESCO, K-Electric, IESCO, FESCO, MEPCO, PESCO, HESCO, SEPCO, QESCO), NEPRA tariff structures, Protected vs Unprotected consumer slabs, Fuel Price Adjustments (FPA), Peak vs Off-Peak hours (5 PM - 11 PM or 6 PM - 10 PM), Solar Net Metering (on-grid, hybrid, battery backup), and household/commercial appliance efficiency in Pakistan.

GUIDELINES:
- Respond in the requested language/script (English, Urdu in Nastaliq/Arabic script, or Roman Urdu like "Aap ka billing slab Unprotected category mein ata hai..."). Default to clear, structured English with Pakistani context if language is unspecified.
- Include precise numbers, PKR savings calculations, and practical actionable tips for Pakistani households (e.g. inverter AC temperature settings 26°C, turning off water pumps during peak hours, UPS inverter efficiency, solar payback estimation).
- Keep formatting clean using markdown, bullet points, and bold terms.
- User Context provided: ${context ? JSON.stringify(context) : "None"}.
- Be extremely respectful, helpful, encouraging, and accurate to 2025/2026 NEPRA rules in Pakistan.`;

    // Construct conversation contents
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (history && Array.isArray(history)) {
      history.forEach((h: { sender: string; text: string }) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      text: response.text || "I apologize, I could not process your query at this moment.",
    });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message || "Unknown error",
    });
  }
});

// AI Bill Scanner & OCR Analyzer Endpoint
app.post("/api/ai/analyze-bill", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", discoHint } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image base64 data is required" });
    }

    // Clean base64 string if data URL prefix exists
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const ai = getGeminiClient();

    const promptText = `Analyze this electricity bill image from Pakistan (${discoHint || "Any DISCO like LESCO, K-Electric, IESCO, MEPCO, etc."}).
Extract structured details and return a strictly valid JSON response matching the structure below.

Return JSON ONLY (no markdown formatting, no code blocks):
{
  "disco": "Name of DISCO (e.g., LESCO, K-Electric, IESCO, MEPCO, FESCO, PESCO, HESCO, SEPCO, QESCO)",
  "billingMonth": "e.g. July 2025",
  "referenceNumber": "e.g. 14 11234 5678900",
  "unitsConsumed": 350,
  "isProtected": false,
  "peakUnits": 80,
  "offPeakUnits": 270,
  "currentBillAmount": 24500,
  "totalAmountDue": 26800,
  "dueDate": "15-Aug-2025",
  "fuelPriceAdjustment": 1850,
  "totalTaxes": 6200,
  "keyObservations": [
    "Observation 1 regarding consumption slab",
    "Observation 2 regarding tax or FPA impact"
  ],
  "savingsRecommendations": [
    "Specific actionable tip 1 to drop to a lower slab or reduce bill",
    "Specific tip 2 regarding peak hours or inverter appliances",
    "Solar suggestion if bill > Rs 15,000"
  ]
}

If any specific field cannot be determined clearly from the image, estimate reasonably based on Pakistani bill standards or provide a polite placeholder note in observations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
    });

    let rawText = response.text || "";
    // Clean JSON formatting markdown backticks if present
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsedData = JSON.parse(rawText);
      return res.json({ success: true, data: parsedData });
    } catch (parseError) {
      console.warn("JSON parse failed, returning fallback formatted text:", rawText);
      return res.json({
        success: true,
        data: {
          rawResponse: rawText,
          keyObservations: ["Bill scanned successfully."],
          savingsRecommendations: ["Verify units and slab on official DISCO app."],
        },
      });
    }
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-bill:", error);
    return res.status(500).json({
      error: "Failed to analyze bill image",
      details: error.message || "Unknown error",
    });
  }
});

// AI Solar Net-Metering Consultant Endpoint
app.post("/api/ai/solar-recommendation", async (req, res) => {
  try {
    const { monthlyUnits, monthlyBillPkr, city, roofAreaSqFt, systemType } = req.body;

    const ai = getGeminiClient();

    const promptText = `Provide a customized solar energy solution proposal for a home/business in ${city || "Pakistan"}.
Details:
- Average Monthly Consumption: ${monthlyUnits || 500} kWh (Units)
- Current Monthly Electricity Bill: Rs ${monthlyBillPkr || 25000} PKR
- Available Roof Space: ${roofAreaSqFt || 800} sq ft
- Preferred System Type: ${systemType || "Hybrid (Solar + Grid + Battery Backup for Load Shedding)"}

Analyze and return JSON ONLY (no markdown code blocks):
{
  "recommendedCapacityKw": 8,
  "numberOfPanels": 15,
  "panelWattageEach": 585,
  "inverterType": "8kW Hybrid Inverter with Net-Metering Support",
  "batteryCapacity": "10kWh Lithium LiFePO4 or 4x 200Ah Tubular Batteries",
  "estimatedCostPkr": {
    "min": 1100000,
    "max": 1350000
  },
  "monthlyGenerationKwh": 1000,
  "monthlyBillAfterSolarPkr": 2500,
  "monthlySavingsPkr": 22500,
  "annualSavingsPkr": 270000,
  "paybackPeriodMonths": 52,
  "netMeteringBuybackRatePkr": 22.5,
  "customAdvice": [
    "Key recommendation 1 for ${city || "Pakistan"}",
    "Key recommendation 2 regarding DISCO net metering application process",
    "Key recommendation 3 regarding structural roof orientation (South facing at 30-35 deg)"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
    });

    let rawText = response.text || "";
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json({ success: true, data: parsed });
    } catch (err) {
      return res.json({ success: false, rawText });
    }
  } catch (error: any) {
    console.error("Error in /api/ai/solar-recommendation:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Server Initialization with Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ ElectraCoach AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
