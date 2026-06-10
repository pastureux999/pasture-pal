module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: "STRIPE_SECRET_KEY not configured" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON" }); }
  }

  const { sessionId } = body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  try {
    // Retrieve the checkout session with subscription expanded
    const sessionRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=subscription`,
      { headers: { "Authorization": `Bearer ${secretKey}` } }
    );
    const session = await sessionRes.json();
    if (!sessionRes.ok) return res.status(400).json({ error: session.error?.message || "Session not found" });

    const sub = session.subscription;

    // No subscription attached (e.g. one-time payment) — treat as active
    if (!sub || typeof sub === "string") {
      return res.status(200).json({ isActive: true, status: "no_subscription" });
    }

    const activeStatuses = ["active", "trialing", "past_due"];
    const isActive = activeStatuses.includes(sub.status);

    return res.status(200).json({ isActive, status: sub.status });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
