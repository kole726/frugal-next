import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-gray-700">Frugal</span>
            <span className="text-green-700">Rx</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/api-test" className="text-blue-600 hover:text-blue-800">
              API Testing
            </Link>
            <button className="bg-pink-500 text-white font-medium py-2 px-6 rounded-full">
              Download Card
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            We Help You Save Up to <br />
            80% on Prescriptions
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Because Meds Shouldn't Break the Bank
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-700 mb-2">59,000+</p>
              <p className="text-gray-600">Participating Pharmacies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-700 mb-2">1M+</p>
              <p className="text-gray-600">Customers Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-700 mb-2">$500M+</p>
              <p className="text-gray-600">Customer Savings</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
