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
