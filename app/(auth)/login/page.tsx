'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SocialIcon } from '@/components/icons/SocialIcons';
import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogoContainer from '@/components/website/LogoContainer';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<'google' | 'github' | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: '/'
      });

      if (error) {
        setError(error.message || 'Invalid email or password.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialSignIn(provider: 'google' | 'github') {
    setError('');
    setSocialLoading(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/'
      });
    } catch {
      setError(`Unable to continue with ${provider}. Please try again.`);
      setSocialLoading(null);
    }
  }

  const isBusy = isLoading || socialLoading !== null;

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-4 pb-6 text-center">
          {/* Brand */}
          <div className="mx-auto flex items-center justify-center mt-4">
            <LogoContainer href="/" className="" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>

            <CardDescription className="text-sm leading-6">
              Sign in to your an account and get back to work.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleSocialSignIn('google')}
              className="h-11 cursor-pointer">
              {socialLoading === 'google' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting
                </>
              ) : (
                <>
                  <SocialIcon platform="google" className="mr-2 h-4 w-4" />
                  Google
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleSocialSignIn('github')}
              className="h-11 cursor-pointer">
              {socialLoading === 'github' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting
                </>
              ) : (
                <>
                  <SocialIcon platform="github" className="mr-2 h-4 w-4" />
                  GitHub
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Email/password */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                autoComplete="email"
                disabled={isBusy}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>

                <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                disabled={isBusy}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isBusy}
              className="h-11 w-full bg-primary font-semibold shadow-lg shadow-primary/20">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Register */}
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have a JobMan account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
