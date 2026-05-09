import { buildApiUrl } from "@/utils/apiBaseUrl";

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
  const res = await fetch(buildApiUrl("/api/payments/stripe-checkout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res, "Stripe checkout could not be created.");
  return typeof data === "string" ? { url: data } : data;
}

export async function createPayment(payload) {
  const email = payload.email || payload.metadata?.email;

  if (!payload.bookingId) {
    throw new Error("Booking ID is required to create Stripe checkout.");
  }

  if (!email) {
    throw new Error("Email is required to create Stripe checkout.");
  }

  const checkoutPayload = {
    bookingId: payload.bookingId,
    email,
    items: payload.items?.length
      ? payload.items
      : [
          {
            name: payload.metadata?.tripName || "KEMET booking",
            description: payload.metadata?.description || "KEMET travel booking",
            image: payload.metadata?.image,
            price: Number(payload.amount || 0),
            quantity: 1,
          },
        ],
  };

  return createStripeCheckout(checkoutPayload);
}
