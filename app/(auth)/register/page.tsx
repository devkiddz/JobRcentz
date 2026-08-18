'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SocialIcon } from '@/components/icons/SocialIcons';
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
