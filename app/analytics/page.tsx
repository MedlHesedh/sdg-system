import Dashboard from "@/components/dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Material Cost and Workers Daily Rate Forecast</h1>
        <Dashboard />
      </div>
    </main>
  )
}
