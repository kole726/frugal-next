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
              <div className="ml-2 bg-green-500 h-5 w-5 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                  <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
          <div className="ml-auto flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 flex items-center group transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <button className="bg-pink-500 text-white font-medium py-2 px-6 rounded-full hover:bg-pink-600 transition duration-150 shadow-sm hover:shadow flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
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