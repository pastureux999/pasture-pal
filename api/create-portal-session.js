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

  const origin = req.headers.origin || "https://www.mypasturepal.com";

  try {
    // Look up the checkout session to get the customer ID
    const sessionRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { "Authorization": `Bearer ${secretKey}` },
    });
    const session = await sessionRes.json();
    if (!sessionRes.ok) return res.status(400).json({ error: session.error?.message || "Session not found" });

    const customerId = session.customer;
    if (!customerId) return res.status(400).json({ error: "No customer found for this session" });

    // Create the portal session
    const params = new URLSearchParams({
      customer: customerId,
      return_url: `${origin}/PasturePal.html`,
    });

    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const portal = await portalRes.json();
    if (!portalRes.ok) return res.status(400).json({ error: portal.error?.message || "Portal error" });

    return res.status(200).json({ url: portal.url });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
