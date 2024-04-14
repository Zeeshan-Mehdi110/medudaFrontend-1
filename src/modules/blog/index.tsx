"use client"
import React, { useEffect, useState } from "react"
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { DatePicker, Input } from "@medusajs/ui";
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
  title: string;
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
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState({
    title: '',
    startDate: "",
    endDate: "",
    author: '',
    tags: ''
  });
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const {t} = useTranslation();

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        const data: BlogPost[] = await fetchBlogPosts(locale, null);
        setBlogPosts(data);
        setFilteredPosts(data); // Initialize with all data
  
        // Extract unique authors and tags
        const authorSet = new Set(data.map(post => post.attributes.Author));
        const tagSet = new Set(data.flatMap(post => post.attributes[`tags_${locale}` as keyof BlogPostAttributes]));
        setAuthors([...authorSet]);
        setTags([...tagSet]);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };
  
    getBlogPosts();
  }, [locale]);


  useEffect(() => {

  
    const results = blogPosts.filter(post => {
      const postDate = new Date(post.attributes.publishedAt);
      const meetsTitleCriteria = post.attributes.title.toLowerCase().includes(filter.title.toLowerCase());
      const startDate = filter.startDate ? new Date(filter.startDate) : null;
      const endDate = filter.endDate ? new Date(filter.endDate) : null;
      const meetsDateCriteria = (
        (!startDate || postDate >= startDate) && 
        (!endDate || postDate <= endDate)
      );
      const meetsAuthorCriteria = filter.author === "" || post.attributes.Author === filter.author;
      const meetsTagsCriteria = filter.tags === "" || post.attributes[`tags_${locale}` as keyof BlogPostAttributes].includes(filter.tags);
  
      return meetsTitleCriteria && meetsDateCriteria && meetsAuthorCriteria && meetsTagsCriteria;
    });
  
    setFilteredPosts(results);
  }, [filter.title, filter.startDate, filter.endDate, filter.author, filter.tags, blogPosts, locale]);
  

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAuthor = e.target.value;
    setFilter(prev => ({ ...prev, author: newAuthor }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = e.target.value;
    setFilter(prev => ({ ...prev, tags: newTag }));
  };

  const handleTitleChange = (e:any) => {
    const newFilter = {...filter, title: e.target.value};
    setFilter(newFilter);
  };

  return (






  
    
     


    <section aria-label={t("blog-section")} className="flex flex-col w-full pr-6 pl-6 gap-4 justify-center items-center mb-8">
    <div className="flex flex-col gap-4">
      <div className="w-full">  <Input 
  type="text"
  name="title"
  value={filter.title}
  onChange={handleTitleChange}
  placeholder={t("filter-by-title")}
/></div>
    <div className="flex gap-4 w-full flex-wrap justify-evenly">

<DatePicker 
  onChange={(value) => {
    if (value?.from && value?.to) {
      setFilter({
        ...filter,
        startDate: value.from.toISOString(),
        endDate: value.to.toISOString()
      });
    }
  }}
  mode="range"
  
/>
<select className="min-h-[40px] pl-1 pr-1 border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"  value={filter.author} onChange={handleAuthorChange} >
  <option value="">{t("select-author")}</option>
  {authors.map(author => (
    <option key={author} value={author}>{author}</option>
  ))}
</select>

<select  value={filter.tags} onChange={handleTagsChange} className=" pl-1 pr-1 min-h-[40px] border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out" >
  <option value="">{t("select-tags")}</option>
  {tags.map(tag => (
    <option key={tag} value={tag}>{tag}</option>
  ))}
</select>
</div>
</div>
{filteredPosts.length === 0 && <span className="mt-4 font-semibold text-xl">{t("no-posts-found")}</span>}
    {filteredPosts.map((post) => (
      <a key={post.attributes.uniqueId} aria-label={t("blog-post-link")} href={`/blog/${post.attributes.uniqueId}`} data-title={post.attributes.title} data-date={convertToDDMMYYYY(post.attributes.publishedAt)} data-author={post.attributes.Author} data-tags={post.attributes[`tags_${locale}` as keyof BlogPostAttributes]} className="blog-post-card sm:w-3/4 w-full mb-4 p-4 rounded border dark:text-white border-gray-200 shadow-lg">
      <div  key={post.id} className="h-[300px] mb-4 fade-bottom-text">
        <h2 className="mb-2 text-lg font-semibold">{post.attributes.Author}</h2>
        <div className="flex justify-center text-xl mb-2">
    {post.attributes[`tags_${locale}` as keyof BlogPostAttributes].join(' | ')}
  </div>
        <BlocksRenderer content={post.attributes.blogBody} />
      </div>
      <div className="relative"><div className="h-[16px] absolute z-10 opacity-65"></div></div>
      <p className="text-sm text-gray-600">{t("published-on")}: {convertToDDMMYYYY(post.attributes.publishedAt)}</p>
       <div>
      
    </div>
    <a  href={`/blog/${post.attributes.uniqueId}`} aria-label={t("blog-post-link")}  className="text-blue-500 p-4 hover:underline"
            >{t("read-more")}</a>
         </a >
    ))}
  </section>

    // <section aria-label={t("blog-section")} className="flex flex-col w-full pr-6 pl-6 gap-4 justify-center items-center mb-8">
    //   {blogPosts.map((post) => (
    //     <a key={post.attributes.uniqueId} aria-label={t("blog-post-link")}  data-date={convertToDDMMYYYY(post.attributes.publishedAt)} data-author={post.attributes.Author} data-tags={post.attributes[`tags_${locale}` as keyof BlogPostAttributes]} href={`/blog/${post.attributes.uniqueId}`} className="blog-post-card sm:w-3/4 w-full mb-4 p-4 rounded border dark:text-white border-gray-200 shadow-lg ">
    //     <div className="h-[300px] mb-4 fade-bottom-text ">
    //       <h2 className="mb-2 text-lg font-semibold">{post.attributes.Author}</h2>
    //       <div className="flex justify-center text-xl mb-2">
    //   {post.attributes[`tags_${locale}` as keyof BlogPostAttributes].join(' | ')}
    // </div>
    //       <BlocksRenderer content={post.attributes.blogBody} />
    //     </div>
    //      <p className="text-sm text-gray-600">{t("published-on")}: {convertToDDMMYYYY(post.attributes.publishedAt)}</p>
    //      <div>
        
    //   </div>
    //      <a  href={`/blog/${post.attributes.uniqueId}`} aria-label={t("blog-post-link")}  className="text-blue-500 p-4 hover:underline"
    //         >{t("read-more")}</a>
    //      </a >
    //   ))}
    // </section>
  );
};

export default BlogModule;