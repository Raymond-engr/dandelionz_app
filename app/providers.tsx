'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { NotificationProvider } from '@/lib/features/notification/NotificationProvider';
import { RECENT_SEARCHES_KEY } from '@/lib/hooks/use-recent-searches';
// import AuthCheck from '@/components/AuthCheck';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore auth from localStorage on app load
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const { user, accessToken, refreshToken } = JSON.parse(savedAuth);
      store.dispatch(setCredentials({ user, accessToken, refreshToken }));
    }
  }, []);

  // Save auth to localStorage whenever it changes
  useEffect(() => {
    let wasAuthenticated = store.getState().auth.isAuthenticated;

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const isAuthenticated = state.auth.isAuthenticated;

      if (isAuthenticated) {
        localStorage.setItem('auth', JSON.stringify({
          user: state.auth.user,
          accessToken: state.auth.accessToken,
          refreshToken: state.auth.refreshToken,
        }));
      } else {
        localStorage.removeItem('auth');
        // Search history is per-browser, not per-account, so a session ending
        // has to clear it or the next person to sign in here sees it. Guarded
        // on the transition: this callback runs on every dispatched action, so
        // clearing whenever `isAuthenticated` is merely false would wipe a
        // signed-out visitor's history continuously and it would never persist.
        if (wasAuthenticated) {
          localStorage.removeItem(RECENT_SEARCHES_KEY);
        }
      }

      wasAuthenticated = isAuthenticated;
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <NotificationProvider>
        {/* <AuthCheck /> */}
        {children}
      </NotificationProvider>
    </Provider>
  );
}