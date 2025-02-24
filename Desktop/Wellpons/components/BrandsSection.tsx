import React from 'react'
import Image from 'next/image'

const BrandsSection = () => {
  const brands = [
    { name: 'Brand 1', logo: '/images/brands/brand1.svg' },
    { name: 'Brand 2', logo: '/images/brands/brand2.svg' },
    { name: 'Brand 3', logo: '/images/brands/brand3.svg' },
    { name: 'Brand 4', logo: '/images/brands/brand4.svg' },
    { name: 'Brand 5', logo: '/images/brands/brand5.svg' },
    { name: 'Brand 6', logo: '/images/brands/brand6.svg' },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Trusted by Leading Wellness Brands
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We partner with top brands to bring you the best deals
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-4 bg-white rounded-lg"
            >
              <div className="relative h-12 w-full">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandsSection 