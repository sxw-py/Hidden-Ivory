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
    const { customer, items, totalAmount } = await req.json();

    // Validate required fields
    if (!customer?.fullName || !customer?.email || !customer?.phone || !customer?.idNumber || !customer?.address) {
      return new Response(JSON.stringify({ error: "Missing customer details" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!totalAmount || totalAmount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid total amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client with service role key (to bypass RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract the user ID from the Authorization header if present
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader) {
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id ?? null;
    }

    // 1. Insert a PENDING order into the database
    const { data: order, error: dbError } = await supabase.from("orders").insert({
      user_id: userId,
      customer_name: customer.fullName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_id_number: customer.idNumber,
      shipping_address: customer.address,
      items: items,
      total_amount: totalAmount,
      status: "Pending",
    }).select().single();

    if (dbError) {
      console.error("DB Error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Call Yoco Checkout API to create a checkout session
    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") || "http://localhost:5173";

    const yocoResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${yocoSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100), // Yoco expects cents
        currency: "ZAR",
        successUrl: `${siteUrl}/payment-success?orderId=${order.id}`,
        cancelUrl: `${siteUrl}/checkout`,
        failureUrl: `${siteUrl}/payment-failure?orderId=${order.id}`,
        metadata: {
          orderId: order.id,
          customerEmail: customer.email,
          customerName: customer.fullName,
        },
      }),
    });

    const yocoData = await yocoResponse.json();

    if (!yocoResponse.ok) {
      console.error("Yoco API Error:", yocoData);
      // Clean up the pending order
      await supabase.from("orders").delete().eq("id", order.id);
      return new Response(JSON.stringify({ error: "Failed to create payment session", details: yocoData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Store the Yoco checkout ID on the order for reference
    await supabase.from("orders").update({
      payment_token: yocoData.id,
    }).eq("id", order.id);

    // 4. Return the redirect URL to the frontend
    return new Response(JSON.stringify({
      redirectUrl: yocoData.redirectUrl,
      orderId: order.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
