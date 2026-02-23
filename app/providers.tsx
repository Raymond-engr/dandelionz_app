'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { NotificationProvider } from '@/lib/features/notification/NotificationProvider';
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
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.auth.isAuthenticated) {
        localStorage.setItem('auth', JSON.stringify({
          user: state.auth.user,
          accessToken: state.auth.accessToken,
          refreshToken: state.auth.refreshToken,
        }));
      } else {
        localStorage.removeItem('auth');
      }
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