import { getDashboardUser } from '@/server/actions/dashboard/getDashboardUser';
import DashboardShell from './components/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getDashboardUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
