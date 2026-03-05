import Link from "next/link"

const features = [
  { name: "Dashboard", path: "/dev/dashboard", status: "planned" },
  { name: "Prompts", path: "/dev/prompts", status: "planned" },
  { name: "Content Gaps", path: "/dev/content-gaps", status: "planned" },
  { name: "Brands", path: "/dev/brands", status: "planned" },
  { name: "Crawler Logs", path: "/dev/crawler-logs", status: "planned" },
  { name: "Visitor Analytics", path: "/dev/visitor-analytics", status: "planned" },
  { name: "Settings", path: "/dev/settings", status: "planned" },
]

export default function DevIndexPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground">Dev Preview Routes</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Feature preview pages for UI development. Each route runs without a backend using mock data.
      </p>
      <div className="mt-8 flex flex-col gap-2">
        {features.map((f) => (
          <Link
            key={f.path}
            href={f.path}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="text-sm font-medium text-foreground">{f.name}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {f.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
