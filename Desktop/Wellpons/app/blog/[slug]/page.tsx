import React from 'react'
import { graphQLClient } from '@/lib/graphql-client'
import Image from 'next/image'
import type { Post } from '@/types/wordpress'

export const revalidate = 3600 // Revalidate every hour

async function getPost(slug: string): Promise<Post | null> {
  try {
    const query = `
      query GetPost($slug: String!) {
        post(id: $slug, idType: SLUG) {
          id
          title
          content
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `
    const { post } = await graphQLClient.request(query, { slug })
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <article className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {post.featuredImage && (
          <div className="relative h-96 mb-8">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <time className="text-gray-500 mb-8 block">
          {new Date(post.date).toLocaleDateString()}
        </time>
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
} 