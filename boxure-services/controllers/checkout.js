import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// This test secret API key is a placeholder. Don't include personal details in requests with this key.
// To see your test secret API key embedded in code samples, sign in to your Stripe account.
// You can also find your test secret API key at https://dashboard.stripe.com/test/apikeys.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);

export async function getStripeSessionDetails(req, res) {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Fetch line items for more detail
    const lineItems = await stripe.checkout.sessions.listLineItems(session_id);

    res.json({ session, lineItems });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
}

export async function createStripeCheckoutSession(req, res) {
  const clientItems = req.body.items; // Line items sent from the client

  if (!clientItems || !Array.isArray(clientItems) || clientItems.length === 0) {
    return res.status(400).json({ error: "No line items provided." });
  }

  const validatedClientItems = [];

  for (const item of clientItems) {
    // 1. Validate incoming data structure
    if (typeof item.productId === "undefined" || typeof item.quantity === "undefined") {
      console.warn("Invalid item structure received:", item);
      return res.status(400).json({ error: "Invalid line item structure." });
    }

    const requestedQuantity = parseInt(item.quantity, 10);
    const requestedProductId = parseInt(item.productId, 10);

    // 2. Validate product ID as an integer
    if (isNaN(requestedProductId) || requestedProductId <= 0) {
      console.warn(`Invalid product ID received: ${item.productId}`);
      return res.status(400).json({ error: `Invalid product ID: ${item.productId}.` });
    }

    // 3. Validate quantity as a positive integer
    if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
      console.warn(`Invalid quantity for product ${requestedProductId}:`, item.quantity);
      return res.status(400).json({ error: `Invalid quantity for a line item.` });
    }

    // Add to a list of validated items
    validatedClientItems.push({ productId: requestedProductId, quantity: requestedQuantity });
  }

  if (validatedClientItems.length === 0) {
    return res.status(400).json({ error: "No valid line items after validation." });
  }

  const productIdsToFetch = validatedClientItems.map((item) => item.productId);

  const { data: productsData, error: dbError } = await supabase
    .from("items")
    .select("id, name, description, price")
    .in("id", productIdsToFetch);

  if (dbError) {
    console.error("Supabase error fetching products:", dbError);
    return res.status(500).json({ error: "Failed to retrieve product details from database." });
  }

  if (!productsData || productsData.length === 0) {
    return res.status(404).json({ error: "No products found matching the provided IDs." });
  }

  const productMap = new Map(productsData.map((p) => [p.id, p]));
  const validatedLineItems = [];

  for (const item of validatedClientItems) {
    const productDetails = productMap.get(item.productId);

    if (!productDetails) {
      console.warn(`Product not found in our Supabase catalog: ${item.productId}`);
      return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
    }

    // Construct the Stripe line_item with data from Supabase
    validatedLineItems.push({
      price_data: {
        currency: "usd", // From Supabase
        product_data: {
          name: productDetails.name, // From Supabase
          description: productDetails.description, // Good to include for Stripe's reconciliation if needed
          // images: [productDetails.imageUrl], // If you have an image column
        },
        unit_amount: productDetails.price * 100, // From Supabase (in cents)
      },
      quantity: item.quantity, // Validated quantity from client
    });
  }

  if (validatedLineItems.length === 0) {
    return res.status(400).json({ error: "No valid line items after validation." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: validatedLineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/shopping-bag`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
