module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in environment variables" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON body" }); }
  }

  const { system, messages, maxTokens = 600, imageBase64, imageMediaType = "image/jpeg", model } = body || {};
  // Vision requests use sonnet (more reliable image analysis); text-only uses haiku (cheaper)
  const modelId = model || (imageBase64 ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001");

  // If an image is provided, convert the last user message to vision format
  let apiMessages = messages || [];
  if (imageBase64 && apiMessages.length > 0) {
    const last = apiMessages[apiMessages.length - 1];
    if (last.role === "user" && typeof last.content === "string") {
      apiMessages = [
        ...apiMessages.slice(0, -1),
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: imageMediaType, data: imageBase64 }
            },
            { type: "text", text: last.content }
          ]
        }
      ];
    }
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: maxTokens,
        system: system || "You are a helpful homestead assistant.",
        messages: apiMessages,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: `Anthropic API error ${response.status}: ${responseText}` });
    }

    const data = JSON.parse(responseText);
    const content = data.content?.[0]?.text || "";
    return res.status(200).json({ content });

  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
