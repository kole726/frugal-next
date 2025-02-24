import React from 'react'
import Image from 'next/image'

const SavingsAreas = () => {
  const areas = [
    {
      title: 'Health & Fitness',
      description: 'Gym memberships, fitness classes, and wellness programs',
      icon: '/images/fitness.svg',
    },
    {
      title: 'Mental Health',
      description: 'Therapy sessions, meditation apps, and wellness coaching',
      icon: '/images/mental-health.svg',
    },
    {
      title: 'Nutrition',
      description: 'Healthy meal plans, supplements, and nutrition consulting',
      icon: '/images/nutrition.svg',
    },
    {
      title: 'Medical Services',
      description: 'Dental care, vision care, and preventive health services',
      icon: '/images/medical.svg',
    },
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Save on Your Wellness Journey
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover discounts across multiple wellness categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {areas.map((area) => (
            <div
              key={area.title}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 relative h-16 w-16 mx-auto">
                <Image
                  src={area.icon}
                  alt={area.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                {area.title}
              </h3>
              <p className="text-gray-600 text-center">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SavingsAreas 