import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  featuredImage: string
  date: string
}

const LatestNews = () => {
  // This would typically come from WordPress via GraphQL
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Top 10 Wellness Trends for 2024',
      excerpt: 'Discover the latest trends in health and wellness that are shaping the industry...',
      slug: 'top-wellness-trends-2024',
      featuredImage: '/images/blog/wellness-trends.jpg',
      date: '2024-03-15',
    },
    {
      id: '2',
      title: 'How to Make the Most of Your Wellness Budget',
      excerpt: 'Learn effective strategies to maximize your wellness spending without compromising...',
      slug: 'maximize-wellness-budget',
      featuredImage: '/images/blog/wellness-budget.jpg',
      date: '2024-03-10',
    },
    {
      id: '3',
      title: 'The Ultimate Guide to Mental Wellness',
      excerpt: 'A comprehensive guide to maintaining mental health in today\'s fast-paced world...',
      slug: 'mental-wellness-guide',
      featuredImage: '/images/blog/mental-wellness.jpg',
      date: '2024-03-05',
    },
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Latest Wellness News</h2>
          <p className="mt-4 text-lg text-gray-600">
            Stay informed with our latest articles and tips
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <h3 className="text-xl font-semibold mt-2 mb-3">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestNews 