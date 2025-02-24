import React from 'react'

const HowItWorks = () => {
  const steps = [
    {
      title: 'Sign Up',
      description: 'Create your free account to access exclusive wellness discounts',
      icon: '📝',
    },
    {
      title: 'Browse Deals',
      description: 'Explore our curated selection of health and wellness offers',
      icon: '🔍',
    },
    {
      title: 'Save Money',
      description: 'Use your exclusive discount codes at checkout and save',
      icon: '💰',
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How Wellpons Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Get started with these simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div 
              key={step.title}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks 