'use client';
import { Auth, onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export function useUser(auth: Auth) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // If no user, sign in anonymously
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, isLoading };
}

    