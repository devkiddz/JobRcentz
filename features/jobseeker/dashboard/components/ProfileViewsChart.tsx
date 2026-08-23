interface ProfileViewsChartProps {
  data: {
    date: string;
    label: string;
    views: number;
  }[];

  peakViews: number;
}

export default function ProfileViewsChart({ data, peakViews }: ProfileViewsChartProps) {
  const totalViews = data.reduce((total, item) => total + item.views, 0);

  const maximum = Math.max(...data.map(item => item.views), 1);

  return (
    <div className="rounded-xl border bg-card">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="border-b px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Profile Views</h3>

            <p className="mt-1 text-sm text-muted-foreground">Profile visits over the last 30 days.</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Peak day</p>

            <p className="text-sm font-semibold">{peakViews} views</p>
          </div>
        </div>
      </div>

      {/* =========================================================
          TOTAL
      ========================================================= */}

      <div className="p-5">
        <div>
          <p className="text-3xl font-bold">{totalViews}</p>

          <p className="text-xs text-muted-foreground">Views in the last 30 days</p>
        </div>

        {/* =======================================================
            CHART
        ======================================================= */}

        <div className="mt-5 flex h-48 items-end gap-1 overflow-hidden rounded-lg bg-muted/40 p-3">
          {data.map(item => {
            const height = item.views === 0 ? 4 : Math.max((item.views / maximum) * 100, 8);

            return (
              <div
                key={item.date}
                className="group flex h-full flex-1 items-end"
                title={`${item.label}: ${item.views} views`}>
                <div
                  className="w-full rounded-sm bg-primary/70 transition-colors group-hover:bg-primary"
                  style={{
                    height: `${height}%`
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
