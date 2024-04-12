import BlogModule from "@modules/blog";
import initTranslations from "app/i18n";

export default async function Blog({params}: {params: any}) {
    const {locale} = params;
    const { t } = await initTranslations(locale, ['common']);

  return (
    <>
    <div className="flex flex-col justify-center items-center gap-4 p-8 mt-9 mb-9 dark:bg-black dark:text-white">
        <h1 className="text-xl font-semibold">Welcome to Pixels Journey blog</h1>
        <p>Here you will find all the latest news and updates about our products and services.</p>
    </div>
    <div>
      <BlogModule locale={locale}></BlogModule>
    </div>
    </>
  )
}
