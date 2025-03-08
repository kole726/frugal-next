import Link from 'next/link';

export default function DrugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white text-gray-800 py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold flex items-center">
              <span className="text-gray-700">Frugal</span>
              <span className="text-green-600">Rx</span>
            </div>
          </Link>
          <div className="ml-auto flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 flex items-center group transition-all duration-200"
            >
              Home
            </Link>
            <button className="bg-pink-500 text-white font-medium py-2 px-6 rounded-full hover:bg-pink-600 transition duration-150 shadow-sm hover:shadow">
              Download Card
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>
      
      <footer className="bg-gray-800 text-gray-300 py-8">
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