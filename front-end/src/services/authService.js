// Mock authentication service for frontend testing.
// Replace fake responses with real backend API calls .
// Mock authentication service for frontend testing.
// Replace fake responses with real backend API calls later.

export const loginUser = async (formData) => {
  console.log("Login data to send to backend:", formData);

  if (formData.email === "user@test.com" && formData.password === "123456") {
    return {
      token: "fake-user-token",
      user: {
        id: "1",
        name: "User",
        email: formData.email,
        role: "user",
      },
    };
  }

  if (formData.email === "guide@test.com" && formData.password === "123456") {
    return {
      token: "fake-guide-token",
      user: {
        id: "2",
        name: "Guide",
        email: formData.email,
        role: "guide",
      },
    };
  }

  if (formData.email === "admin@test.com" && formData.password === "123456") {
    return {
      token: "fake-admin-token",
      user: {
        id: "3",
        name: "Admin",
        email: formData.email,
        role: "admin",
      },
    };
  }

  throw new Error("Invalid email or password");
};

export const registerUser = async (formData) => {
  console.log("Register data to send to backend:", formData);

  return {
    token: "fake-token",
    user: {
      id: "4",
      name: formData.name,
      email: formData.email,
      role: "user",
    },
  };
};

export const loginWithGoogle = async () => {
  console.log("Google login will be connected to backend later.");

  return {
    token: "fake-google-token",
    user: {
      id: "5",
      name: "Google User",
      email: "googleuser@test.com",
      role: "user",
    },
  };
};