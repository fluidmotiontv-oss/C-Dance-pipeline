import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Server-side Gemini AI client initialization with fallback safety
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY not set. Using server fallback algorithms.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Deterministic prompt compiler helper
function getFallbackSeedancePrompt(
  characterName: string,
  sceneAction: string,
  cameraTrajectory: string,
  location: string,
  motionFlowScore: number,
  cfgScale: number,
  aspectRatio: string
) {
  const cleanAction = (sceneAction || "Leaning over counter").trim().replace(/\.$/, "");
  const seed = Math.floor(Math.random() * 899999) + 100000;
  const seedance25Prompt = `${cleanAction}, ${characterName} in Dragon 9 cartoon animation pipeline, 4K anime styling, Seedance 2.5 C Dance video diffusion, glassmorphism UI overlays, liquid chrome physics, neon aqua and ultraviolet rim lighting, camera trajectory: ${cameraTrajectory}, location: ${location}, octane render quality, cel-shaded precision, hyper-detailed streetwear textures, 60fps silky smooth motion flow --motion ${motionFlowScore} --cfg ${cfgScale} --ar ${aspectRatio} --seed ${seed}`;
  const negativePrompt = "static camera, jittery frames, lowres, blurry, photorealistic human skin, muddy colors, deformed anatomy, flickering artifacts, oversaturated bloom, watermark, text glitches";

  return {
    characterName,
    seedance25Prompt,
    negativePrompt,
    cameraVector: cameraTrajectory,
    motionFlowScore,
    cfgScale,
    lightingSpec: "Volumetric neon aqua rim light with liquid chrome specular highlights",
    audioSyncNote: "Sub-bass 808 drop at 432Hz with filtered Rhodes chord and vinyl crackle",
  };
}

// 1. Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    engine: "Dragon 9 Seedance 2.5 Pipeline Server",
    cDanceSupported: true,
    multimodalSlotsMax: 50,
    timestamp: new Date().toISOString(),
  });
});

// 2. Generate Precision Seedance 2.5 Prompt via Gemini with Fallback
app.post("/api/generate-seedance-prompt", async (req, res) => {
  const {
    characterName = "Super Puff",
    sceneAction = "Leaning over the bodega counter, twisting an invisible dial in mid-air",
    cameraTrajectory = "Dynamic 360 Orbit",
    location = "Iridescent Corner Bodega at Spacetime Rift",
    motionFlowScore = 9.2,
    cfgScale = 8.0,
    aspectRatio = "16:9",
    customDirectives = "",
  } = req.body;

  const fallbackData = getFallbackSeedancePrompt(
    characterName,
    sceneAction,
    cameraTrajectory,
    location,
    motionFlowScore,
    cfgScale,
    aspectRatio
  );

  const ai = getGeminiAI();
  if (!ai) {
    return res.json({
      success: true,
      source: "deterministic_compiler",
      data: fallbackData,
    });
  }

  const systemInstruction = `You are the Lead Cinematographer and AI Prompt Architect for Seedance 2.5 (via C Dance) and Dragon 9 animated productions. Your task is to output precision generative video prompts for C Dance.
Core style rules:
- 4K anime styling with cel-shaded vector precision
- Glassmorphism interface overlays and holographic HUD reticles
- Liquid chrome physics and iridescent mercury fluid dynamics
- Neon aqua (#00f3ff) and ultraviolet violet (#b026ff) highlights
- Volumetric atmospheric fog with light shafts
- Continuous motion flow index with 60fps pan/tilt/zoom vectors
Return JSON matching the schema.`;

  const contents = `Generate a production-ready Seedance 2.5 C Dance generative video prompt for character "${characterName}". Action: "${sceneAction}". Location: "${location}". Camera Trajectory: "${cameraTrajectory}". ${customDirectives ? `Directives: ${customDirectives}` : ""}`;

  // Try Primary Model (gemini-3.8-flash) first, then Fallback Model (gemini-3.1-flash-lite), then Deterministic Fallback
  const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              characterName: { type: Type.STRING },
              seedance25Prompt: {
                type: Type.STRING,
                description: "Full production prompt formatted for Seedance 2.5 generative video diffusion including camera motion and C Dance style flags",
              },
              negativePrompt: { type: Type.STRING },
              cameraVector: { type: Type.STRING },
              motionFlowScore: { type: Type.NUMBER },
              cfgScale: { type: Type.NUMBER },
              lightingSpec: { type: Type.STRING },
              audioSyncNote: { type: Type.STRING },
            },
            required: ["characterName", "seedance25Prompt", "negativePrompt", "cameraVector", "lightingSpec", "audioSyncNote"],
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          success: true,
          source: model,
          data: parsed,
        });
      }
    } catch (err: any) {
      console.warn(`Gemini model ${model} temporarily unavailable (${err.message}). Retrying fallback...`);
    }
  }

  // Graceful Fallback if all Gemini models are unavailable (503/429/etc)
  console.log("Using deterministic fallback compiler due to Gemini high demand / rate limit.");
  return res.json({
    success: true,
    source: "deterministic_fallback",
    data: fallbackData,
  });
});

// 3. Generate Character Sheet & Reference Tagging Metadata with Fallback
app.post("/api/generate-character-sheet", async (req, res) => {
  const { characterName = "Super Puff", role = "hero", description = "" } = req.body;

  const fallbackData = {
    characterName,
    styleAnchor: "4K anime styling, cel-shaded vector precision, liquid chrome jacket physics",
    referenceTags: [
      `D9_${characterName.toUpperCase().replace(/\s+/g, "_")}`,
      "4K_ANIME_STYLING",
      "CELL_SHADED_LINE_ART",
      "LIQUID_CHROME_ACCENTS",
      "GLOWING_CYAN_VISOR",
      "360_MODEL_SHEET_LOCK",
      "C_DANCE_SEEDANCE_2.5_REF",
      "NO_IDENTITY_DRIFT"
    ],
    promptTemplate: `Subject: ${characterName}, Dragon 9 character model, {TURNAROUND_ANGLE} angle view, 4K anime styling, cel-shaded vector lines, liquid chrome reflections.`,
  };

  const ai = getGeminiAI();
  if (!ai) {
    return res.json({
      success: true,
      source: "deterministic_compiler",
      data: fallbackData,
    });
  }

  const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Generate a character design sheet specification for "${characterName}" (Role: ${role}). Description: "${description}".`,
        config: {
          systemInstruction: "You are a Character Designer for Dragon 9 animation. Generate 360 turnaround character sheet metadata and 10 reference tags to prevent identity drift in Seedance 2.5 C Dance.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              characterName: { type: Type.STRING },
              styleAnchor: { type: Type.STRING },
              referenceTags: { type: Type.ARRAY, items: { type: Type.STRING } },
              promptTemplate: { type: Type.STRING },
            },
            required: ["characterName", "styleAnchor", "referenceTags", "promptTemplate"],
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          success: true,
          source: model,
          data: parsed,
        });
      }
    } catch (err: any) {
      console.warn(`Character sheet model ${model} unavailable (${err.message}). Retrying fallback...`);
    }
  }

  return res.json({
    success: true,
    source: "deterministic_fallback",
    data: fallbackData,
  });
});

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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dragon 9 Seedance 2.5 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
