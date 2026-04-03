'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

function keepDigits(value) {
  return value.replace(/\D/g, '').slice(-10);
}

export default function HomePage() {
  const router = useRouter();
  const { isReady, token, role, loginSession } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && token) {
      router.replace(role === 'admin' ? '/admin' : '/chat');
    }
  }, [isReady, role, router, token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          mobileNumber,
          pin
        }
      });

      loginSession(response);
      router.replace(response.role === 'admin' ? '/admin' : '/chat');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isReady) {
    return <LoadingScreen label="Checking your session..." />;
  }

  return (
    <main className="flex min-h-screen items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="app-grid">
        <AuthCard
          error={error}
          loading={loading}
          mobileNumber={mobileNumber}
          onMobileChange={(value) => setMobileNumber(keepDigits(value))}
          onPinChange={(value) => setPin(value.replace(/\D/g, '').slice(0, 6))}
          onSubmit={handleSubmit}
          pin={pin}
        />
      </div>
    </main>
  );
}
