import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostTemplate from '@/app/components/BlogPostTemplate'
import { IBlog } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<IBlog | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return undefined;
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return undefined;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | SecurityX Blog',
      description: 'The requested blog post could not be found.'
    }
  }

  const { title, seo, excerpt, tags, author, publishedAt, createdAt, coverImage } = post;

  return {
    title: seo?.metaTitle || title,
    description: seo?.metaDescription || excerpt,
    keywords: seo?.metaKeywords || tags,
    authors: [{ name: author.name }],
    openGraph: {
      title: seo?.metaTitle || title,
      description: seo?.metaDescription || excerpt,
      type: 'article',
      publishedTime: (publishedAt || createdAt)?.toString(),
      authors: [author.name],
      tags: tags,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.metaTitle || title,
      description: seo?.metaDescription || excerpt,
      images: [coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostTemplate post={post} />
} 