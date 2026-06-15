export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required contact payload fields." });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return res.status(200).json({
      success: false,
      fallback: true,
      message: "RESEND_API_KEY environment variable is not configured. Redirecting request parameter payload to native SMTP client fallback."
    });
  }

  try {
    const rawSubject = subject || "SECURE PORTAL MESSAGE";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "JP Portal <onboarding@resend.dev>",
        to: "jeevapravinhere@gmail.com",
        reply_to: email,
        subject: `[JP_PORTAL] ${rawSubject}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; background-color: #0c0c0e; color: #f4f4f5; border: 1px solid #27272a; border-radius: 6px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22d3ee; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-family: monospace;">[ SECURE TELEMETRY RECEIVED ]</h2>
            <p style="margin: 16px 0;"><strong>Sender Name:</strong> ${name}</p>
            <p style="margin: 16px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #22d3ee; text-decoration: none;">${email}</a></p>
            <p style="margin: 16px 0;"><strong>Subject:</strong> ${rawSubject}</p>
            <div style="margin-top: 24px; padding: 16px; background-color: #050506; border-left: 3px solid #22d3ee; font-family: monospace; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap; color: #e4e4e7; line-height: 1.6;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>
            <p style="font-size: 11px; color: #71717a; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 12px; text-align: center; font-family: monospace;">Sent via JP Secure Core Comms Gateway Layer</p>
          </div>
        `
      })
    });

    if (response.ok) {
      const data = await response.json();
      return res.json({ success: true, fallback: false, data });
    } else {
      const errData = await response.json();
      console.error("Resend API Error details:", errData);
      return res.status(500).json({ 
        success: false, 
        error: "Mailing service reported transmission failure.", 
        details: errData 
      });
    }

  } catch (error: any) {
    console.error("Mailing Route Error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Error contacting external mailing gateway service.",
      details: error.message 
    });
  }
}
