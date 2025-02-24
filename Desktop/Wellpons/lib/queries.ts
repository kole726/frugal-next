export const GET_POSTS = `
  query GetPosts {
    posts(first: 10) {
      nodes {
        id
        title
        slug
        excerpt
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
  }
`

export const GET_DISCOUNTS = `
  query GetDiscounts {
    discounts(first: 20) {
      nodes {
        id
        title
        slug
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        discountMeta {
          discountCode
          discountAmount
          expiryDate
          terms
        }
      }
    }
  }
` 