import React from 'react'

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Wellness Discounts That Help You Live Your Best Life
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Being Healthy is Now Affordable with Wellpons
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600"
            >
              Activate Account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 