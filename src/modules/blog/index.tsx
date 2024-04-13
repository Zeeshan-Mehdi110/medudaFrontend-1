"use client"
import React, { useEffect, useState } from "react"
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { useTranslation } from "react-i18next";
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
    return data
  } catch (error) {
    console.error("Error fetching blog posts:", error)
  }
}


export function convertToDDMMYYYY(dateString: string) {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0") // getMonth() is zero-based
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}



type BlogPostAttributes = {
  blogBody: any; // Specify the correct type for blogBody
  Author: string;
  uniqueId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  tags_en:string[];
  tags_he:string[]
};

type BlogPost = {
  id: number;
  attributes: BlogPostAttributes;
};

// Adjust the fetchBlogPosts function if needed (not shown here for brevity)

const BlogModule: React.FC<{locale:string}> = ({locale}:{locale:string}) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const isRtl = locale === "ar" || locale === "he"
  const { t } = useTranslation();
  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        // Assume fetchBlogPosts returns the correct type; adjust as necessary
        const data: BlogPost[] = await fetchBlogPosts(locale as string, null);
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    getBlogPosts();
  }, [locale]);

  return (
    <section aria-label={t("blog-section")} className="flex flex-col w-full pr-6 pl-6 gap-4 justify-center items-center">
      {blogPosts.map((post) => (
        <a key={post.attributes.uniqueId} aria-label={t("blog-post-link")}  data-date={convertToDDMMYYYY(post.attributes.publishedAt)} data-author={post.attributes.Author} data-tags={post.attributes[`tags_${locale}` as keyof BlogPostAttributes]} href={`/blog/${post.attributes.uniqueId}`} className="blog-post-card sm:w-3/4 w-full mb-4 p-4 rounded border dark:text-white border-gray-200 shadow-lg ">
        <div className="h-[300px] mb-4 fade-bottom-text ">
          <h2 className="mb-2 text-lg font-semibold">{post.attributes.Author}</h2>
          <div className="flex justify-center text-xl mb-2">
      {post.attributes[`tags_${locale}` as keyof BlogPostAttributes].join(' | ')}
    </div>
          <BlocksRenderer content={post.attributes.blogBody} />
        </div>
         <p className="text-sm text-gray-600">{t("published-on")}: {convertToDDMMYYYY(post.attributes.publishedAt)}</p>
         <div>
        
      </div>
         <a  href={`/blog/${post.attributes.uniqueId}`} aria-label={t("blog-post-link")}  className="text-blue-500 p-4 hover:underline"
            >{t("read-more")}</a>
         </a >
      ))}
    </section>
  );
};

export default BlogModule;