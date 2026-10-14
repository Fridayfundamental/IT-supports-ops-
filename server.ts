import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

// Lazy/safe initialization for Gemini
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Endpoint: AI Diagnostic Troubleshooting
app.post("/api/gemini/diagnose", async (req, res) => {
  try {
    const { title, description, category, os, assetTag } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Graceful offline fallback for presentation/interview if API key is missing
      return res.json({
        success: true,
        source: "fallback",
        analysis: {
          likelyRootCauses: [
            "Cached credentials or Kerberos token expiration",
            "Network interface DNS / gateway routing conflict",
            "Background service hang or local profile corruption",
          ],
          diagnosticSteps: [
            "Verify physical connectivity and IP lease via `ipconfig /all`",
            "Test name resolution and gateway ping via `nslookup` and `ping`",
            "Check Windows Event Viewer for recent Application/System error IDs",
            "Attempt credential refresh / policy update via `gpupdate /force`",
          ],
          suggestedCommands: [
            "ipconfig /flushdns",
            "gpupdate /force",
            "net stop spooler && net start spooler",
          ],
          escalationRecommendation:
            "If unresolved after 15 minutes of Tier 1 triage, escalate to Tier 2 Systems Engineering with Event Viewer logs attached.",
          itilPriorityRecommendation: "P3 - Medium (Impact: Single user, Urgency: Normal business hours)",
        },
      });
    }

    const prompt = `You are a Senior IT Helpdesk Lead assisting an IT Support Specialist.
Analyze the following support ticket:
Title: ${title}
Category: ${category}
Operating System / Device: ${os || "Windows 11 Enterprise"}
Asset Tag: ${assetTag || "N/A"}
User Reported Problem:
${description}

Provide a structured JSON response with:
1. "likelyRootCauses": array of 3 concise root cause hypotheses.
2. "diagnosticSteps": array of 4-5 sequential Tier-1 troubleshooting steps suitable for an IT Support Specialist.
3. "suggestedCommands": array of 2-4 CLI/PowerShell/terminal commands relevant to this issue.
4. "escalationRecommendation": guidance on when to escalate (e.g. to Tier 2, Network Operations, or SecOps).
5. "itilPriorityRecommendation": recommended priority (P1, P2, P3, P4) with brief justification based on impact and urgency.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      source: "gemini",
      analysis: parsed,
    });
  } catch (error: any) {
    console.error("Gemini diagnose error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate diagnostic plan",
    });
  }
});

// Endpoint: Draft Customer Communication (Email / Ticket update)
app.post("/api/gemini/draft-response", async (req, res) => {
  try {
    const { ticketTitle, customerName, tone, updateType, internalNotes } = req.body;
    const ai = getAiClient();

    if (!ai) {
      const genericTemplates: Record<string, string> = {
        first_contact: `Hi ${customerName},\n\nThank you for contacting the IT Support Desk. I am currently reviewing your request regarding "${ticketTitle}".\n\nI have initiated initial diagnostics and will keep you closely informed on our progress. If you are at your workstation, please let me know a convenient time should a quick remote session be needed.\n\nBest regards,\nIT Support Specialist`,
        investigating: `Hi ${customerName},\n\nWe are actively investigating the issue with "${ticketTitle}". Our team has reviewed the diagnostic logs and is currently testing a configuration fix.\n\nWe will update you within the next 30 minutes with our findings.\n\nBest regards,\nIT Support Specialist`,
        resolved: `Hi ${customerName},\n\nGood news! We have implemented a resolution for "${ticketTitle}". The underlying service has been restored and verified on our monitoring dashboard.\n\nPlease test on your end and let us know if everything is functioning as expected. We will follow up shortly to confirm your satisfaction.\n\nBest regards,\nIT Support Specialist`,
      };

      return res.json({
        success: true,
        source: "fallback",
        draft: genericTemplates[updateType] || genericTemplates.first_contact,
      });
    }

    const prompt = `You are an IT Support Specialist known for excellent, empathetic customer service and clear technical communication.
Draft a professional email update to the employee:
Customer Name: ${customerName}
Ticket: ${ticketTitle}
Update Stage: ${updateType} (e.g. first_contact, investigating, action_required, resolved, escalation)
Tone: ${tone || "professional, warm, and reassuring"}
Internal Notes / Context: ${internalNotes || "Working on restoring normal operations promptly."}

Requirements:
- Address the customer respectfully by first name.
- Clearly explain what IT is doing without overwhelming them with obscure jargon.
- Provide clear next steps and when to expect the next update.
- Keep within SLA customer communication standards.
- Output ONLY the email body text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.json({
      success: true,
      source: "gemini",
      draft: response.text?.trim() || "",
    });
  } catch (error: any) {
    console.error("Gemini draft error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate draft response",
    });
  }
});

// Endpoint: Generate Standard Knowledge Base Article from Ticket
app.post("/api/gemini/kb-generate", async (req, res) => {
  try {
    const { title, category, rootCause, stepsTaken, resolution } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        article: {
          title: `KB-${Math.floor(1000 + Math.random() * 9000)}: Standard Resolution for ${title}`,
          category: category || "General IT",
          symptoms: `User experiences issues related to ${title}.`,
          rootCause: rootCause || "Configuration mismatch or transient network disconnect.",
          resolutionSteps: stepsTaken || [
            "Verify device network connection and IP validity",
            "Perform local application cache cleanup",
            "Reboot system and verify service health",
          ],
          preventativeMeasures: "Ensure regular system reboot and prompt installation of corporate IT patches.",
        },
      });
    }

    const prompt = `Create a formal IT Knowledge Base (KB) Standard Operating Procedure article based on this resolved helpdesk ticket:
Title: ${title}
Category: ${category}
Root Cause: ${rootCause}
Steps Taken: ${stepsTaken}
Final Resolution: ${resolution}

Return JSON with keys:
- "title": Clean SOP title (e.g., "KB-4021: Resolving Outlook OST Sync Lockouts")
- "category": Category string
- "symptoms": 1-2 sentence description of what the user observed
- "rootCause": Clear technical root cause description
- "resolutionSteps": array of step-by-step instructions for any Tier 1 IT technician to follow
- "preventativeMeasures": 1-2 tips to prevent recurrence`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      source: "gemini",
      article: parsed,
    });
  } catch (error: any) {
    console.error("Gemini KB error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate KB article",
    });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`IT Support Specialist Hub server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
