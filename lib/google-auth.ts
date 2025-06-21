"use client"

declare global {
  interface Window {
    google: any
  }
}

// export const initializeGoogleAuth = () => {
//   return new Promise((resolve, reject) => {
//     if (typeof window === "undefined") {
//       reject("Window is undefined")
//       return
//     }

//     // Load Google Identity Services script
//     const script = document.createElement("script")
//     script.src = "https://accounts.google.com/gsi/client"
//     script.async = true
//     script.defer = true
//     script.onload = () => {
//       if (window.google) {
//         window.google.accounts.id.initialize({
//           client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//           callback: resolve,
//         })
//       }
//     }
//     script.onerror = reject
//     document.head.appendChild(script)
//   })
// }

export const signInWithGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject("Google SDK not loaded")
      return
    }

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Try alternative sign-in method
        window.google.accounts.oauth2
          .initTokenClient({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            scope: "email profile",
            callback: (response: any) => {
              if (response.access_token) {
                resolve(response.access_token)
              } else {
                reject("Failed to get access token")
              }
            },
          })
          .requestAccessToken()
      }
    })

    // Set up credential callback
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        if (response.credential) {
          // Decode JWT to get access token
          fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.credential}`)
            .then((res) => res.json())
            .then((data) => {
              // Get access token for API calls
              window.google.accounts.oauth2
                .initTokenClient({
                  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                  scope: "email profile",
                  callback: (tokenResponse: any) => {
                    resolve(tokenResponse.access_token)
                  },
                })
                .requestAccessToken()
            })
            .catch(reject)
        } else {
          reject("No credential received")
        }
      },
    })
  })
}
