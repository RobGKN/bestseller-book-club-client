// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 Check for a saved token and fetch user profile
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);

      try {
        const { data } = await authAPI.getProfile();
        setCurrentUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async ({ email, password, name, username }) => {
    setError(null);
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
  
      // 2. Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
  
      // 3. Send token + profile data to backend to create a user record
      const { data } = await authAPI.register(
        { name, username, email },
        idToken // pass token separately (see api.js)
      );
  
      // 4. Store the JWT from backend
      localStorage.setItem('token', data.token);
      setCurrentUser(data);
      return data;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        //console.log('auth/emailalreadyinuse triggered');
        setError('That email is already registered. Try logging in instead.');
      } else {
        setError(err.message || 'Registration failed');
      }
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    try {
      // 1. Log in via Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
  
      // 2. Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
  
      // 3. Send token to your backend to get JWT + profile
      const { data } = await authAPI.login(idToken);
  
      // 4. Store JWT and update state
      localStorage.setItem('token', data.token);
      setCurrentUser(data);
      return data;
    } catch (err) {
      const message = err.code === 'auth/user-not-found'
        ? 'No account found for that email.'
        : err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
