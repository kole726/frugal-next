export default function DrugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <a href="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">Frugal Pharmacy</a>
          <div className="ml-auto">
            <a href="/" className="text-white hover:text-blue-100 transition-colors">Home</a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-50 py-8 mt-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Frugal Pharmacy. All rights reserved.</p>
          <p className="mt-2 text-sm">This is a demo application for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
} 