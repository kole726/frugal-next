import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center">
            <span className="text-gray-700">Frugal</span>
            <span className="text-green-600">Rx</span>
          </div>
          <div className="flex space-x-4 items-center">
            <Link href="/api-test" className="text-blue-600 hover:text-blue-800 transition duration-150">
              API Testing
            </Link>
            <button className="bg-pink-500 text-white font-medium py-2 px-6 rounded-full hover:bg-pink-600 transition duration-150 shadow-sm hover:shadow">
              Download Card
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow bg-gradient-to-b from-white to-gray-50 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero content */}
          <div className="py-16 text-center relative">
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              We Help You Save Up to <br />
              <span className="text-green-600">80%</span> on Prescriptions
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Because Meds Shouldn't Break the Bank. Compare prices at over 59,000 pharmacies nationwide.
            </p>

            {/* Search Bar with simplified container */}
            <div className="max-w-2xl mx-auto mb-16">
              <SearchBar />
            </div>

            {/* Stats with simplified design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-3xl font-bold text-gray-800 mb-2">59,000+</p>
                <p className="text-gray-600">Participating Pharmacies</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-3xl font-bold text-gray-800 mb-2">1M+</p>
                <p className="text-gray-600">Customers Served</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-3xl font-bold text-gray-800 mb-2">$500M+</p>
                <p className="text-gray-600">Customer Savings</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">FrugalRx</h3>
              <p className="text-sm">
                Save on your prescriptions at over 59,000 pharmacies nationwide.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition duration-150">About Us</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
              <p className="text-sm mb-4">
                Questions or feedback? We'd love to hear from you.
              </p>
              <a href="mailto:support@frugalrx.com" className="text-green-400 hover:text-green-300 transition duration-150">support@frugalrx.com</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            &copy; {new Date().getFullYear()} FrugalRx. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
