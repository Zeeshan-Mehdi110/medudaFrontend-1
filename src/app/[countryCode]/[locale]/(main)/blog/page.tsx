import BlogModule from "@modules/blog";
import initTranslations from "app/i18n";
import { Metadata, ResolvingMetadata } from "next";
import Image from 'next/image';
import { Poppins } from 'next/font/google'
import blogHeroBanner from "../../../../../../public/blogHeroBanner.jpg"

const inter = Poppins({subsets:["latin"], weight: "600"})

export async function generateMetadata(
  { params }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
  const translatedKeywords = t("pixels-journey-blog-seo-keywords").split(', ');

  return {
    title: "Pixels Journey Blog",
    description: t("pixels-journey-blog-seo-description"),
    keywords: translatedKeywords,
    openGraph: {
      images: ['/blog-hero-banner.jpg']
    }
  };
}

export default async function Blog({params}: {params: any}) {
    const {locale} = params;
    const { t } = await initTranslations(locale, ['common']);

  return (
    <>
    <div className={`${inter.className}  flex flex-col justify-center items-center gap-4 p-8 mt-9 mb-9 dark:bg-black dark:text-white`}>
        <h1 className="text-xl font-semibold">Welcome to Pixels Journey blog</h1>
        <p>Here you will find all the latest news and updates about our products and services.</p>
        <Image  placeholder="blur" style={{borderRadius:'6px',marginTop:'0.5rem'}} src={blogHeroBanner} alt="Blog hero banner image" width={800} height={400} loading="lazy" />
    </div>
    <div>
      <BlogModule locale={locale}></BlogModule>
    </div>
    </>
  )
}
