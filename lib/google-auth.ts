"use client";

declare global {
  interface Window {
    google: any;
  }
}

// Load the GSI script
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("Window is undefined");

    if (document.querySelector("script[src='https://accounts.google.com/gsi/client']")) {
      return resolve();
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject("Failed to load Google SDK");
    document.head.appendChild(script);
  });
};

// Returns access token from Google (to send to backend)
export const signInWithGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      return reject("Google SDK not loaded");
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope: "openid email profile",
      callback: (response: any) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject("Failed to get access token");
        }
      },
    });

    client.requestAccessToken();
  });
};
