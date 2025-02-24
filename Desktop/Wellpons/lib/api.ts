import { graphQLClient } from './graphql-client'
import { GET_POSTS, GET_DISCOUNTS } from './queries'
import type { Post, Discount } from '@/types/wordpress'

export async function getPosts(): Promise<Post[]> {
  try {
    const { posts } = await graphQLClient.request(GET_POSTS)
    return posts.nodes
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getDiscounts(): Promise<Discount[]> {
  try {
    const { discounts } = await graphQLClient.request(GET_DISCOUNTS)
    return discounts.nodes
  } catch (error) {
    console.error('Error fetching discounts:', error)
    return []
  }
} 