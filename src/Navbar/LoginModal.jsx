// import { GoogleAuthProvider } from "firebase/auth";
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const LoginModal = ({ onClose }) => {
  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Optional: Add custom claims for new users via your backend using the ID token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      onClose();
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Login</h3>
        <input type="text" placeholder="Phone Number (coming soon)" disabled />
        <button onClick={handleGoogleLogin}>Continue with Google</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
