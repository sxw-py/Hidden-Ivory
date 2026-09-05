import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function starsToText(n: number): string {
  return "★".repeat(n) + "☆".repeat(5 - n) + ` (${n}/5)`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { overall, subRatings, enjoyedMost, doneBetter, processIssues, changeProduct, purchaseAgain, lookingFor } = body;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build sub-ratings HTML
    const subRatingsHtml = Object.entries(subRatings || {})
      .map(([key, val]) => `<tr><td style="padding: 0.5rem 1rem; color: #fff; font-family: system-ui, sans-serif;">${key}</td><td style="padding: 0.5rem 1rem; color: #e5b876; font-family: system-ui, sans-serif;">${starsToText(val as number)}</td></tr>`)
      .join("");

    const processHtml = (processIssues || []).length > 0
      ? `<ul style="color: #fff; font-family: system-ui, sans-serif;">${(processIssues as string[]).map(p => `<li style="margin-bottom: 0.35rem;">${p}</li>`).join("")}</ul>`
      : `<p style="color: rgba(255,255,255,0.5); font-family: system-ui, sans-serif;">No issues reported</p>`;

    const html = `
      <div style="font-family: Georgia, serif; max-width: 650px; margin: 0 auto; padding: 2rem; background: #000; color: #fff;">
        <h1 style="color: #e5b876; font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">Hidden Ivory</h1>
        <p style="text-align: center; color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-bottom: 1.5rem;">Customer Experience Feedback</p>
        <hr style="border: none; height: 1px; background: #e5b876; opacity: 0.3; margin-bottom: 2rem;" />

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Overall Experience</h2>
        <p style="font-family: system-ui, sans-serif; font-size: 1.2rem; margin-bottom: 2rem;">${starsToText(overall)}</p>

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Product Ratings</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
          ${subRatingsHtml}
        </table>

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">What They Enjoyed Most</h2>
        <p style="font-family: system-ui, sans-serif; line-height: 1.6; margin-bottom: 2rem;">${enjoyedMost || "—"}</p>

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">What Could Be Done Better</h2>
        <p style="font-family: system-ui, sans-serif; line-height: 1.6; margin-bottom: 2rem;">${doneBetter || "—"}</p>

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Buying Process Issues</h2>
        ${processHtml}
        <div style="margin-bottom: 2rem;"></div>

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Change One Thing About the Product</h2>
        <p style="font-family: system-ui, sans-serif; line-height: 1.6; margin-bottom: 2rem;">${changeProduct || "—"}</p>

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">What Would Make Them Purchase Again</h2>
        <p style="font-family: system-ui, sans-serif; line-height: 1.6; margin-bottom: 2rem;">${purchaseAgain || "—"}</p>

        <hr style="border: none; height: 1px; background: #e5b876; opacity: 0.3; margin: 2rem 0;" />

        <h2 style="color: #e5b876; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">The Hidden Ivory Question</h2>
        <p style="color: rgba(255,255,255,0.5); font-style: italic; font-size: 0.95rem; margin-bottom: 0.5rem;">"You were looking for something when you found us. What was it?"</p>
        <p style="font-family: system-ui, sans-serif; line-height: 1.6; margin-bottom: 2rem;">${lookingFor || "—"}</p>

        <hr style="border: none; height: 1px; background: #e5b876; opacity: 0.3; margin: 2rem 0;" />
        <p style="text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem;">Hidden Ivory — The Experience Feedback</p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hidden Ivory <orders@hiddenivory.com>",
        to: ["hiddenivory.support@gmail.com"],
        reply_to: "hiddenivory.support@gmail.com",
        subject: `Customer Experience Feedback — ${starsToText(overall)}`,
        html,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Resend response:", emailResult);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in send-experience:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
