import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center">
            <span className="text-gray-700">Frugal</span>
            <span className="text-green-600">Rx</span>
            <div className="ml-2 bg-green-500 h-5 w-5 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
              </svg>
            </div>
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
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-pink-100 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-100 to-transparent rounded-full transform -translate-x-1/2"></div>
              <div className="absolute top-10 right-10 w-20 h-20 bg-blue-100 rounded-full"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              We Help You Save Up to <br />
              <span className="text-green-600">80%</span> on Prescriptions
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Because Meds Shouldn't Break the Bank. Compare prices at over 59,000 pharmacies nationwide.
            </p>

            {/* Search Bar with enhanced container */}
            <div className="max-w-2xl mx-auto mb-16 relative">
              <div className="absolute inset-0 bg-white rounded-xl shadow-xl blur"></div>
              <div className="relative bg-white p-4 rounded-xl shadow-lg">
                <SearchBar />
              </div>
            </div>

            {/* Stats with enhanced design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105">
                <div className="text-green-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-2">59,000+</p>
                <p className="text-gray-600">Participating Pharmacies</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105">
                <div className="text-green-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-2">1M+</p>
                <p className="text-gray-600">Customers Served</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105">
                <div className="text-green-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
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
