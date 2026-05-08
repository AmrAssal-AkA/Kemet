const API_BASE_URL = "https://kemet-two.vercel.app/";

async function handleResponse(res, errorMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[tripServices]", {
      url: res.url,
      status: res.status,
      body: data,
    });
    throw new Error(data?.message || data?.error || errorMessage);
  }

  return data;
}

function getHeaders(cookie) {
  return cookie ? { Cookie: cookie } : {};
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.trips)) return data.trips;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function getFileNameFromUrl(imageUrl) {
  try {
    const url = new URL(imageUrl, window.location.origin);
    const fileName = url.pathname.split("/").filter(Boolean).pop();
    return fileName || "trip-image.jpg";
  } catch {
    return "trip-image.jpg";
  }
}

async function getImageFileFromUrl(imageUrl) {
  if (imageUrl instanceof File) return imageUrl;

  const imageResponse = await fetch(imageUrl);

  if (!imageResponse.ok) {
    throw new Error("Image URL could not be loaded.");
  }

  const imageBlob = await imageResponse.blob();
  const fileName = getFileNameFromUrl(imageUrl);
  const fileType = imageBlob.type || "image/jpeg";

  return new File([imageBlob], fileName, { type: fileType });
}

export async function createTrip(payload) {
  const imageFile = await getImageFileFromUrl(payload.image || payload.imageUrl);
  const formData = new FormData();

  formData.append("name", payload.name || payload.title);
  formData.append("city", payload.city);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price || 0));
  formData.append("duration", String(payload.duration));
  formData.append("location", payload.location);
  formData.append("guideAvailable", String(Boolean(payload.guideAvailable)));
  formData.append("guidefees", String(payload.guidefees || 0));
  formData.append("guestCapacity", String(payload.guestCapacity || 1));
  formData.append("image", imageFile);

  const res = await fetch(`${API_BASE_URL}/api/Trip/addTrip`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleResponse(res, "Trip could not be created.");
}

export async function getTrips() {
  const res = await fetch(`${API_BASE_URL}/api/Trip`, {
    credentials: "include",
  });

  const data = await handleResponse(res, "Trips could not be loaded.");
  return getArray(data);
}

export async function getAdminTrips(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/Trip`, {
    headers: getHeaders(cookie),
    credentials: "include",
  });

  const data = await handleResponse(res, "Trips could not be loaded.");
  return getArray(data);
}

export async function getTripById(id) {
  const res = await fetch(`${API_BASE_URL}/api/Trip/${id}`, {
    credentials: "include",
  });

  return handleResponse(res, "Trip could not be loaded.");
}

export async function updateTrip(id, payload) {
  const imageFile = await getImageFileFromUrl(payload.image || payload.imageUrl);
  const formData = new FormData();

  formData.append("name", payload.name || payload.title);
  formData.append("city", payload.city);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price || 0));
  formData.append("duration", String(payload.duration));
  formData.append("location", payload.location);
  formData.append("guideAvailable", String(Boolean(payload.guideAvailable)));
  formData.append("guidefees", String(payload.guidefees || 0));
  formData.append("guestCapacity", String(payload.guestCapacity || 1));
  formData.append("image", imageFile);

  const res = await fetch(`${API_BASE_URL}/api/Trip/updateTrip/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  return handleResponse(res, "Trip could not be updated.");
}

export async function deleteTrip(id) {
  const res = await fetch(`${API_BASE_URL}/api/Trip/deleteTrip/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res, "Trip could not be deleted.");
}
