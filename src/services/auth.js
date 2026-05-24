import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function loginVendor(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
}
