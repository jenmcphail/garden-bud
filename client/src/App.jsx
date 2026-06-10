import { useState } from 'react'
import PlantCard from './components/PlantCard'

const API_URL = 'http://localhost:3001/api/recommendations'

export default function App() {
  const [zip, setZip] = useState('')
  const [zone, setZone] = useState(null)
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setZone(null)
    setPlants([])
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please try again.')
      }

      setZone(data.zone)
      setPlants(data.plants)
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Unable to reach the server. Make sure it is running on port 3001.'
          : err.message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-tan-50 font-sans text-sage-800">
      <header className="border-b border-tan-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-sage-800">
            GardenBud
          </h1>
          <p className="mt-1 text-sm text-sage-600">
            Plant recommendations tailored to your hardiness zone.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="zip" className="sr-only">
            ZIP code
          </label>
          <input
            id="zip"
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            placeholder="Enter ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
            className="flex-1 rounded-lg border border-tan-200 bg-white px-4 py-2.5 text-sage-800 placeholder:text-sage-600/50 focus:border-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-600/20"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || zip.length !== 5}
            className="rounded-lg bg-terracotta-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Finding plants…' : 'Get recommendations'}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-terracotta-400/30 bg-terracotta-400/10 px-4 py-3 text-sm text-terracotta-600"
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 flex flex-col items-center gap-3 text-sage-600">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-sage-200 border-t-sage-600"
              aria-hidden="true"
            />
            <p className="text-sm">Looking up your zone and picking plants…</p>
          </div>
        )}

        {!loading && zone && plants.length > 0 && (
          <section className="mt-10">
            <p className="mb-6 text-sm text-sage-600">
              USDA Hardiness Zone{' '}
              <span className="font-medium text-sage-800">{zone}</span>
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {plants.map((plant) => (
                <PlantCard key={plant.name} plant={plant} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
