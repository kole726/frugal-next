import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Discounts', href: '/discounts' },
        { label: 'Blog', href: '/blog' },
        { label: 'FAQs', href: '/faqs' },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Wellpons</h3>
            <p className="text-gray-400">
              Your gateway to affordable wellness and health services.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Wellpons. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 