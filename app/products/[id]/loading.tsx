import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white h-16" />
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="bg-white rounded-lg border p-8 mb-6">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </main>
    </div>
  )
}
