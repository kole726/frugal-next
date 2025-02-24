import React from 'react'
import { getPosts } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {post.featuredImage && (
                <div className="relative h-48">
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <h2 className="text-xl font-semibold mt-2 mb-3">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h2>
                <div 
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
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
    </div>
  )
} 