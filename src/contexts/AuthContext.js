import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Giriş kaydını veritabanına ekle
      const loginRef = ref(database, `users/${user.uid}/logins/${Date.now()}`);
      await set(loginRef, {
        type: 'login',
        timestamp: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        // Çıkış kaydını veritabanına ekle
        const logoutRef = ref(database, `users/${currentUser.uid}/logins/${Date.now()}`);
        await set(logoutRef, {
          type: 'logout',
          timestamp: new Date().toISOString()
        });
      }
      
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 