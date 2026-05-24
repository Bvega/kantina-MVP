import { auth, isFirebaseConfigured } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * Sign in vendor with email and password.
 * Supports fallback mock logic if Firebase environment variables are missing.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user?: object, error?: string}>}
 */
export async function loginVendor(email, password) {
  if (!isFirebaseConfigured) {
    console.log("🔑 [Auth Mock] Attempting login for email:", email);
    if (email && password) {
      const mockUser = {
        uid: "mock-vendor-123",
        email: email,
        displayName: "Vendor Ambulante (Demo)",
      };
      localStorage.setItem("kantina_mock_user", JSON.stringify(mockUser));
      window.dispatchEvent(new Event("kantina_mock_auth_change"));
      return { user: mockUser };
    }
    return { error: "Email and password are required." };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Sign out the currently authenticated vendor.
 * Supports fallback mock logic if Firebase environment variables are missing.
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export async function logoutVendor() {
  if (!isFirebaseConfigured) {
    console.log("🔒 [Auth Mock] Logging out");
    localStorage.removeItem("kantina_mock_user");
    window.dispatchEvent(new Event("kantina_mock_auth_change"));
    return { success: true };
  }

  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
