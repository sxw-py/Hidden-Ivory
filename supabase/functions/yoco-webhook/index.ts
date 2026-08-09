import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const event = body.type || body.event;
    
    console.log("Webhook received:", JSON.stringify(body, null, 2));

    // Only process payment.succeeded events
    if (event !== "payment.succeeded") {
      console.log(`Ignoring event: ${event}`);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentData = body.payload || body.data || body;
    const metadata = paymentData.metadata || {};
    const orderId = metadata.orderId;

    if (!orderId) {
      console.error("No orderId found in webhook metadata");
      return new Response(JSON.stringify({ error: "No orderId in metadata" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Update order status to "paid"
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Order ${orderId} marked as Paid`);

    // 2. Send confirmation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey && order?.customer_email) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Hidden Ivory <orders@hiddenivory.com>",
            to: [order.customer_email],
            subject: "Order Confirmed — Hidden Ivory",
            html: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #000; color: #fff;">
                <h1 style="color: #e5b876; font-size: 2rem; text-align: center; margin-bottom: 1.5rem;">Hidden Ivory</h1>
                <hr style="border: none; height: 1px; background: #e5b876; opacity: 0.3; margin-bottom: 2rem;" />
                <p style="font-size: 1.1rem; line-height: 1.6;">Dear ${order.customer_name},</p>
                <p style="font-size: 1.1rem; line-height: 1.6;">Thank you for your order! Your payment has been confirmed.</p>
                <div style="background: #111; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                  <p style="color: #e5b876; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Order Reference</p>
                  <p style="font-family: system-ui, sans-serif; font-size: 1.1rem;">ORD-${order.id.substring(0, 8).toUpperCase()}</p>
                  <p style="color: #e5b876; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1rem; margin-bottom: 0.5rem;">Total</p>
                  <p style="font-family: system-ui, sans-serif; font-size: 1.3rem; font-weight: bold;">R${Number(order.total_amount).toFixed(2)}</p>
                  <p style="color: #e5b876; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1rem; margin-bottom: 0.5rem;">Shipping To</p>
                  <p style="font-family: system-ui, sans-serif; font-size: 1rem;">${order.shipping_address}</p>
                </div>
                <p style="font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,0.7);">We will notify you when your order has been shipped. If you have any questions, feel free to reply to this email.</p>
                <hr style="border: none; height: 1px; background: #e5b876; opacity: 0.3; margin: 2rem 0;" />
                <p style="text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem;">Hidden Ivory — Luxury Streetwear</p>
              </div>
            `,
          }),
        });

        const emailResult = await emailResponse.json();
        console.log("Email sent:", emailResult);
      } catch (emailErr) {
        // Don't fail the webhook if email fails
        console.error("Failed to send email:", emailErr);
      }
    }

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
