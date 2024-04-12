"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { convertToDDMMYYYY, fetchBlogPosts } from '@modules/blog';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
// Assuming fetchBlogPosts and BlogPostBody are imported correctly

type PostAttributes = {
  uniqueId: string;
  blogBody: any; // Specify the correct type for blogBody
  // Include other attributes as needed
  createdAt: string; // Assume date is directly available in attributes for simplicity
  Author: string;
  tags_en: string[];
  tags_he: string[];
};

type BlogPost = {
  id: number;
  attributes: PostAttributes;
};

const BlogPostPage: React.FC = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const uniqueId = useParams().id;
  const locale = useParams().locale as string; // Assuming locale is a string
const { t } = useTranslation();

  useEffect(() => {
    const fetchAndSetPost = async () => {
      if (typeof uniqueId === 'string') { // Ensuring uniqueId is defined and is a string
        const fetchedPosts: BlogPost[] = await fetchBlogPosts(locale, null);
        const matchedPost = fetchedPosts.find(post => post.attributes.uniqueId === uniqueId);

        if (matchedPost) {
          console.log(matchedPost);
          setPost(matchedPost);
        }
      }
    };

    fetchAndSetPost();
  }, [uniqueId, locale]); // Dependency array includes uniqueId and locale to refetch if these change

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <section className='flex w-full justify-center min-h-96 dark:text-white mb-8'>
      <div className="blog-post-container flex justify-center w-full pr-4 pl-4 sm:w-3/4">
        <div className='blog-post-card sm:w-3/4 w-full mt-6'>
          <div className='flex justify-center gap-2 mb-2 font-semibold'><span>{convertToDDMMYYYY(post.attributes.createdAt)}</span></div>
          <div className='flex justify-center mb-8'><span className='text-center'></span>{t("author")}: {post.attributes.Author} | {t("tags")}: {post.attributes[`tags_${locale}` as keyof PostAttributes].join(' , ')}</div>
          <BlocksRenderer content={post.attributes.blogBody} />
        </div>
      </div>
    </section>
  );
};

export default BlogPostPage;