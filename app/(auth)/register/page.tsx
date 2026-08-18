'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import LogoContainer from '@/components/website/LogoContainer';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [acceptTerms, setAcceptTerms] = React.useState(false);

  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<'google' | 'github' | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to create your account.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/onboarding'
      });

      if (error) {
        setError(error.message || 'Unable to create your account.');
        return;
      }

      router.replace('/onboarding');
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
        callbackURL: '/onboarding'
      });
    } catch {
      setError(`Unable to continue with ${provider === 'google' ? 'Google' : 'GitHub'}. Please try again.`);

      setSocialLoading(null);
    }
  }
  const isBusy = isLoading || socialLoading !== null;

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-4 pb-6 text-center">
          <div className="mt-4 flex items-center justify-center">
            <LogoContainer href="/" className="" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>

            <CardDescription className="text-sm leading-6">
              Join JobMan and connect with skilled professionals.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social registration */}
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
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-4 w-4">
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.78-.07-1.53-.22-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.92-4.2 2.92-7.42Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.7Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.53 13.78A5.85 5.85 0 0 1 6.23 12c0-.62.1-1.22.3-1.78V7.69H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.04 4.31l3.24-2.53Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 6.19c1.43 0 2.7.49 3.71 1.45l2.78-2.78C16.83 3.25 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.71 5.39l3.24 2.53c.77-2.31 2.93-4.03 5.47-4.03Z"
                    />
                  </svg>
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
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-4 w-4 fill-current">
                    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49v-1.73c-2.78.62-3.37-1.39-3.37-1.39-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.07 1.53 1.07.9 1.58 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.15-4.55-5.06 0-1.12.39-2.03 1.02-2.75-.1-.26-.44-1.3.1-2.71 0 0 .83-.27 2.75 1.05A9.2 9.2 0 0 1 12 7.91c.85 0 1.71.12 2.51.35 1.92-1.32 2.75-1.05 2.75-1.05.54 1.41.2 2.45.1 2.71.64.72 1.02 1.63 1.02 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.84c0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                  </svg>
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
                Or register with email
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive">
              {error}
            </div>
          )}

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={event => setName(event.target.value)}
                required
                autoComplete="name"
                disabled={isBusy}
                className="h-11"
              />
            </div>

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
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                disabled={isBusy}
                className="h-11"
              />

              <p className="text-xs text-muted-foreground">Use at least 8 characters for your password.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm password
              </label>

              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                disabled={isBusy}
                className="h-11"
              />
            </div>

            {/* Terms */}
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept-terms"
                  checked={acceptTerms}
                  onCheckedChange={checked => setAcceptTerms(checked === true)}
                  disabled={isBusy}
                  className="mt-0.5 cursor-pointer"
                />

                <label
                  htmlFor="accept-terms"
                  className="cursor-pointer text-sm leading-5 text-muted-foreground">
                  I agree to JobMan&apos;s{' '}
                  <Link
                    href="/terms"
                    className="font-medium text-foreground underline underline-offset-2 hover:text-primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="font-medium text-foreground underline underline-offset-2 hover:text-primary">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isBusy}
              className="h-11 w-full cursor-pointer bg-primary font-semibold shadow-lg shadow-primary/20">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          {/* Login */}
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs leading-5 text-muted-foreground">
            By creating an account, you agree to our Terms of Service and acknowledge our Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
