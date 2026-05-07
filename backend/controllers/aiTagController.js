console.log("Gemini Key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO - KEY MISSING");
const fs   = require("fs");
const path = require("path");

// ─── ANALYZE IMAGE WITH GEMINI 1.5 FLASH ──────────────────
// POST /api/items/analyze-image
// Receives an uploaded image, sends it to Gemini, returns tags
const analyzeImage = async (req, res) => {
  try {
    // Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    // Read the uploaded image file and convert to base64
    const imagePath   = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType    = req.file.mimetype; // e.g. "image/jpeg"

    // ── GEMINI API REQUEST ─────────────────────────────────
    const geminiUrl =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    // This prompt tells Gemini exactly what to return
    // We ask for strict JSON so we can parse it reliably
    const prompt = `You are a fashion expert AI. Analyze this clothing/fashion item image and return ONLY a valid JSON object with no extra text, no markdown, no code blocks.

The JSON must have exactly these fields:
{
  "title": "short item name, max 6 words (e.g. Blue Denim Jacket)",
  "description": "2-3 sentence description of the item including key details",
  "category": "one of exactly: Women's Clothing, Men's Clothing, Kids' Clothing, Footwear, Accessories, Jewelry, Outerwear & Seasonal Wear, Bags & Carry Items",
  "condition": "one of exactly: Like New, Excellent, Good, Fair — judge by visible wear",
  "size": "one of exactly: XS, S, M, L, XL, One Size, N/A — use N/A if cannot determine",
  "material": "the fabric or material (e.g. Cotton, Leather, Polyester, Denim, Wool)",
  "color": "the main color(s) of the item (e.g. Navy Blue, Black and White)",
  "style": "the fashion style (e.g. Vintage, Minimalist, Streetwear, Formal, Casual, Bohemian, Sporty)"
}

Return ONLY the JSON. No explanation. No markdown. Just the raw JSON object.`;

    const geminiResponse = await fetch(geminiUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              // Send the image
              {
                inline_data: {
                  mime_type: mimeType,
                  data:      base64Image
                }
              },
              // Send the prompt
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature:     0.1,  // Low temperature = more consistent output
          maxOutputTokens: 500
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API error:", errText);
      return res.status(502).json({ message: "Gemini API request failed.", detail: errText });
    }

    const geminiData = await geminiResponse.json();

    // Extract the text from Gemini's response
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ message: "Gemini returned no content." });
    }

    // ── PARSE THE JSON FROM GEMINI ─────────────────────────
    // Sometimes Gemini wraps it in ```json ... ``` even when told not to
    // So we strip any markdown code fences just in case
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let tags;
    try {
      tags = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", cleaned);
      return res.status(502).json({
        message: "Could not parse AI response. Try again.",
        raw:     cleaned
      });
    }

    // ── VALIDATE & SANITIZE ────────────────────────────────
    // Make sure category and condition match allowed values exactly
    const validCategories = [
      "Women's Clothing", "Men's Clothing", "Kids' Clothing",
      "Footwear", "Accessories", "Jewelry",
      "Outerwear & Seasonal Wear", "Bags & Carry Items"
    ];
    const validConditions = ["Like New", "Excellent", "Good", "Fair"];
    const validSizes      = ["XS", "S", "M", "L", "XL", "One Size", "N/A"];

    if (!validCategories.includes(tags.category)) tags.category  = "";
    if (!validConditions.includes(tags.condition)) tags.condition = "";
    if (!validSizes.includes(tags.size))           tags.size      = "N/A";

    // Clean up temp uploaded file after reading
    // (the user will upload the real image when they submit the form)
    fs.unlinkSync(imagePath);

    // Return the tags to the frontend
    res.json({
      success: true,
      tags: {
        title:       tags.title       || "",
        description: tags.description || "",
        category:    tags.category    || "",
        condition:   tags.condition   || "",
        size:        tags.size        || "N/A",
        material:    tags.material    || "",
        color:       tags.color       || "",
        style:       tags.style       || ""
      }
    });

  } catch (error) {
    console.error("analyzeImage error:", error);
    res.status(500).json({ message: "Server error during image analysis." });
  }
};

module.exports = { analyzeImage };