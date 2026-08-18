import HomeHero from '@/components/website/home/HomeHero';
import FeaturedJobs from '@/components/website/home/FeaturedJobs';

import { getFeaturedJobs } from '@/server/actions/website/getFeaturedJobs';
import PopularCategories from '@/components/website/home/PopularCategories';

export default async function Home() {
  const jobs = await getFeaturedJobs();

  return (
    <div className="min-h-screen">
      <HomeHero jobs={jobs} />

      <PopularCategories />

      <FeaturedJobs jobs={jobs} />

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center lg:px-8">
          <p className="text-sm font-medium text-primary">Job Rcentz</p>

          <h2 className="mx-auto mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Your next opportunity could be closer than you think.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Build your professional profile, discover opportunities, and connect with companies looking for
            people like you.
          </p>
        </div>
      </section>
    </div>
  );
}
