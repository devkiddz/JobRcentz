type AccountRole =
  | 'UNASSIGNED'
  | 'JOB_SEEKER'
  | 'EMPLOYER'
  | 'ADMIN';

export function getAccountDestination(
  role: AccountRole
) {
  switch (role) {
    case 'JOB_SEEKER':
      return '/dashboard/jobseeker';

    case 'EMPLOYER':
      return '/dashboard/employer';

    case 'ADMIN':
      return '/dashboard/admin';

    case 'UNASSIGNED':
    default:
      return '/onboarding';
  }
}