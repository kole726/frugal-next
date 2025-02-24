export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
}

export interface Discount {
  id: string
  title: string
  slug: string
  content: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
  discountMeta: {
    discountCode: string
    discountAmount: string
    expiryDate: string
    terms: string
  }
} 