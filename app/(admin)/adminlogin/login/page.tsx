'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogoContainer from '@/components/website/LogoContainer';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: '/admin'
      });

      if (error) {
        setError(error.message || 'Invalid administrator credentials.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-5 pb-6 text-center">
          <div className="mt-4 flex justify-center">
            <LogoContainer href="/" />
          </div>

          <div className="space-y-2">
            <div className="mx-auto inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Administration
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>

            <CardDescription className="text-sm leading-6">
              Sign in with an authorized administrator account to manage JobMan.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium">
                Administrator email
              </label>

              <Input
                id="admin-email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                autoComplete="username"
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium">
                Password
              </label>

              <Input
                id="admin-password"
                name="password"
                type="password"
                placeholder="Enter administrator password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full bg-primary font-semibold shadow-lg shadow-primary/20">
              {isLoading ? 'Authenticating...' : 'Sign in to Admin'}
            </Button>
          </form>

          <div className="mt-6 border-t pt-5 text-center">
            <p className="text-xs leading-5 text-muted-foreground">
              Authorized personnel only. Unauthorized access attempts are prohibited.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
