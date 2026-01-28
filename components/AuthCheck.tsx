'use client';

import { useAppSelector } from '@/lib/hooks';
import { useValidateTokenQuery } from '@/lib/api/authApi';

export default function AuthCheck() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  // This query will trigger the baseQueryWithReauth logic if the token is expired.
  // If the token is valid, it does nothing (just validates).
  // If 401, it tries refresh. If refresh fails, it logs out.
  useValidateTokenQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  return null;
}