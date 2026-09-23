import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/features/auth/components/login-form';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border bg-background p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <Image src="/images/logo.svg" alt="Falcon Rider" width={64} height={64} className="mx-auto rounded-lg" priority />
        <h1 className="text-2xl font-semibold">{siteConfig.shortName}</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access the operations command center
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-xs text-muted-foreground">
        {siteConfig.fullName}
      </p>
    </div>
  );
}

