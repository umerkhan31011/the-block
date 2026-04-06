import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-24 text-center">
      <p className="text-8xl font-bold text-gray-100 select-none">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mt-2">Page not found</h1>
      <p className="text-gray-500 mt-2 text-sm">
        The vehicle or page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block mt-6 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Browse Inventory
      </Link>
    </main>
  )
}
