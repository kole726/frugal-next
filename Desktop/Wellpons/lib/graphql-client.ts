import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.WORDPRESS_API_URL || 'https://your-wordpress-site.com/graphql'

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: process.env.WORDPRESS_AUTH_TOKEN || '',
  },
}) 