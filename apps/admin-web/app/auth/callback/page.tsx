'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { supabase } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Processing login...')

  useEffect(() => {
    const handleAuth = async () => {
      const storedRedirectUrl = localStorage.getItem('authRedirectUrl');
      
      // Check for OAuth errors in URL
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setMessage('Authentication failed. Redirecting...');
        router.push(`/?auth_error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      // Check for authorization code in URL
      const code = searchParams.get('code');
      
      try {
        let session = null;
        
        // If we have a code, exchange it for a session
        if (code) {
          setMessage('Exchanging authorization code...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setMessage('Authentication failed. Redirecting...');
            router.push(`/?auth_error=${encodeURIComponent(exchangeError.message)}`);
            return;
          }
          
          session = data?.session;
        } else {
          // No code, try to get existing session
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            setMessage('Authentication failed. Redirecting...');
            router.push(`/?auth_error=${encodeURIComponent(sessionError.message)}`);
            return;
          }
          
          session = data?.session;
        }

        if (session?.user) {
          const userId = String(session.user.id);
          
          // Check if user already has a profile in backend
          let profileData = null;
          setMessage('Checking your profile...');
          
          try {
            const profileRes = await fetch(API_ENDPOINTS.getProfileByUUID(userId), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (profileRes.ok) {
              const profileJson = await profileRes.json();
              if (profileJson.success && profileJson.data) {
                profileData = profileJson.data;
              }
            }
          } catch (err) {
            console.error('Error fetching profile:', err);
          }

          if (!profileData) {
            setMessage('Setting up your account...');
            // Create profile in backend
            try {
              const createRes = await fetch(API_ENDPOINTS.createProfile, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uuid: userId,
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                  email: session.user.email || '',
                  phone: session.user.user_metadata?.phone || '',
                  avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }),
              });
              
              if (!createRes.ok) {
                const err = await createRes.json();
                console.error('Error creating profile:', err.message || 'Unknown error');
              }
            } catch (err) {
              console.error('Error creating profile:', err);
            }
          } else {
            setMessage('Updating your account...');
            // Update profile in backend (PATCH)
            try {
              const updateRes = await fetch(API_ENDPOINTS.updateProfileByUUID(userId), {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  updated_at: new Date().toISOString(),
                  avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || profileData.avatar_url,
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || profileData.full_name,
                }),
              });
              
              if (!updateRes.ok) {
                const err = await updateRes.json();
                console.error('Error updating profile:', err.message || 'Unknown error');
              }
            } catch (err) {
              console.error('Error updating profile:', err);
            }
          }

          // Check if there's a stored redirect URL
          let redirectTo = storedRedirectUrl || '/';
          if (typeof window !== 'undefined') {
            const storedUrl = localStorage.getItem('authRedirectUrl');
            if (storedUrl) {
              redirectTo = storedUrl;
              localStorage.removeItem('authRedirectUrl');
            }
          }
          
          setMessage('Redirecting to dashboard...');
          router.push(redirectTo);
        } else {
          // If not authenticated, redirect to home
          setMessage('Authentication failed. Redirecting to home...');
          router.push('/');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setMessage('An error occurred. Redirecting...');
        router.push('/');
      }
    };
    
    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-[#FF6B35] border-t-transparent"></div>
        <p className="text-lg font-medium text-white">{message}</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-[#FF6B35] border-t-transparent"></div>
          <p className="text-lg font-medium text-white">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
