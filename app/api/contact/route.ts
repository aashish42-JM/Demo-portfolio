import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // If Resend is configured, send the email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "AashishOS <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL || "aashish.tim@gmail.com"],
        subject: `New message from ${name} via AashishOS`,
        html: `
          <div style="font-family:monospace;background:#050816;color:#4fc3f7;padding:24px;border-radius:12px;border:1px solid rgba(79,195,247,0.3)">
            <h2 style="color:#90caf9;margin-bottom:16px">New Contact via AashishOS</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#4fc3f7">${email}</a></p>
            <hr style="border-color:rgba(79,195,247,0.2);margin:16px 0"/>
            <p><strong>Message:</strong></p>
            <p style="color:#90caf9;line-height:1.6">${message}</p>
          </div>
        `,
      });
    }

    // Log the message regardless
    console.log("Contact message received:", { name, email, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
