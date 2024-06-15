import { listRegions } from "@lib/data"
import { Metadata, ResolvingMetadata } from "next"
import React from "react"
import { locales } from "../../../../../../../config/config"

// Fetch blog posts function
export const fetchBlogPosts = async (
  locale: string,
  numberOfPosts: number | null
) => {
  try {
    const response2 = await fetch(
      `https://strapi-blog-m4go.onrender.com/api/blog-posts?locale=${locale}`
    )
    const dataObj = await response2.json()
    const { data } = dataObj

    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error)
  }
}


export async function generateStaticParams() {

  const countryCodes = await listRegions().then((regions) =>
    regions?.map((r) => r.countries.map((c) => c.iso_2)).flat()
  ) ?? [];



  let staticParams :any[] = [];
  
  // Iterate over locales and fetch blog posts for each
  await Promise.all(locales.map(async (locale) => {
    const blogPosts = await fetchBlogPosts(locale, null);
   
  
    if (!countryCodes || countryCodes.length === 0) {
      console.error("countryCodes is empty or undefined");
    }
    if (!blogPosts || blogPosts.length === 0) {
      console.error(`blogPosts for locale ${locale} is empty or undefined`);
      return;
    }
  
    const paramsForLocale = countryCodes
      ?.map((countryCode) =>
        blogPosts.map((blogPost: any) => ({
          countryCode,
          locale: locale,
          id: blogPost.attributes.uniqueId,
        }))
      )
      .flat();

    staticParams = [...staticParams, ...paramsForLocale];
  })).catch((error) => {
    console.error("Error fetching blog posts:", error);
  });

  return staticParams;
}

// Generate metadata
export async function generateMetadata(
  { params }: { params: { locale: string; id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const posts = await fetchBlogPosts(params.locale, null);
  const post = posts.find((post: any) => post.attributes.uniqueId === params.id);
  return {
    title: post?.attributes?.title || "Blog Post Title not found",
    description: post?.attributes?.title || "Blog Post not found",
    keywords: post?.attributes[`tags_${params.locale}` as keyof PostAttributes || []],
    openGraph: { images: ["/blog-hero-image.jpg"] },
  }
}

type PostAttributes = {
  uniqueId: string
  blogBody: any // Specify the correct type for blogBody
  createdAt: string // Assume date is directly available in attributes for simplicity
  Author: string
  tags_en: string[]
  tags_he: string[]
}

type BlogPost = {
  id: number
  attributes: PostAttributes
}

// BlogPostLayout component
export default async function BlogPostLayout({
  params,
  children,
}: {
  params: any
  children: any
}) {
  return <div>{children}</div>
}
