import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
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
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49v-1.73c-2.78.62-3.37-1.39-3.37-1.39-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.07 1.53 1.07.9 1.58 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.15-4.55-5.06 0-1.12.39-2.03 1.02-2.75.1-.26-.44-1.3.1-2.71 0 0 .83-.27 2.75 1.05A9.2 9.2 0 0 1 12 7.91c.85 0 1.71.12 2.51.35 1.92-1.32 2.75-1.05 2.75-1.05.54 1.41.2 2.45.1 2.71.64.72 1.02 1.63 1.02 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.84c0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.99h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.56V8.99H3.56v11.46ZM22.22 0H1.78C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.78 24h20.44c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.57l-5.145-6.72L5.15 22H1.89l7.61-8.7L1.5 2h6.738l4.65 6.14L18.244 2Zm-1.153 17.865h1.803L7.227 4.045H5.292l11.799 15.82Z" />
    </svg>
  );
}

export function SocialIcon({
  platform,
  ...props
}: IconProps & {
  platform: 'google' | 'github' | 'linkedin' | 'x';
}) {
  switch (platform) {
    case 'google':
      return <GoogleIcon {...props} />;

    case 'github':
      return <GithubIcon {...props} />;

    case 'linkedin':
      return <LinkedInIcon {...props} />;

    case 'x':
      return <XIcon {...props} />;

    default:
      return null;
  }
}
