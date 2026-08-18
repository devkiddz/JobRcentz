import { requireAdmin } from '@/server/auth/requireAdmin';

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
      <section>
        <p className="text-sm font-medium text-primary">Administration</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">Admin Dashboard</h1>

        <p className="mt-2 text-muted-foreground">Welcome, {admin.name}.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Administrator</p>

          <p className="mt-2 font-semibold">{admin.email}</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Access Level</p>

          <p className="mt-2 font-semibold">{admin.role}</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">System</p>

          <p className="mt-2 font-semibold">JobMan Administration</p>
        </div>
      </section>
    </main>
  );
}
