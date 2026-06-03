'use client';

import { SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SignUpPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
