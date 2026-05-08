const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class PaymentApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "PaymentApiError";
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(res, errorMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[paymentServices]", {
      url: res.url,
      status: res.status,
      body: data,
    });
    throw new PaymentApiError(
      data?.message || data?.error || errorMessage,
      res.status,
      data,
    );
  }

  return data;
}

export async function createStripeCheckout(payload) {
  const res = await fetch(`${API_BASE_URL}/api/payments/stripe-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res, "Stripe checkout could not be created.");
  return typeof data === "string" ? { url: data } : data;
}

export async function createPayment(payload) {
  const amount = Number(payload.amount || 0);
  const checkoutPayload = {
    bookingId: payload.bookingId,
    amount,
    currency: payload.currency || "EGP",
    metadata: payload.metadata || {},
    items: payload.items?.length
      ? payload.items
      : [
          {
            name: payload.metadata?.tripName || "KEMET booking",
            description: payload.metadata?.description || "KEMET travel booking",
            image: payload.metadata?.image,
            price: Math.max(Math.round(amount * 100), 0),
            quantity: 1,
          },
        ],
  };

  return createStripeCheckout(checkoutPayload);
}
