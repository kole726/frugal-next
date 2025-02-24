import { graphQLClient } from './graphql-client'

async function testConnection() {
  try {
    const query = `
      query TestConnection {
        posts(first: 1) {
          nodes {
            title
          }
        }
      }
    `
    const data = await graphQLClient.request(query)
    console.log('Connection successful:', data)
  } catch (error) {
    console.error('Connection failed:', error)
  }
}

testConnection() 