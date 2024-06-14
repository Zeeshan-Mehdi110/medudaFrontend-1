import Head from 'next/head';
import Link from 'next/link';
import initTranslations from 'app/i18n';
import CustomerServiceComponent from '@modules/customer-service';
import ContactUs from '@modules/contact-us';
import { Metadata, ResolvingMetadata } from 'next';


export async function generateMetadata(
  { params }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
  const translatedKeywords = t("pixels-journey-customer-service-keywords").split(', ');

  return {
    title: t("pixels-journey-customer-service"),
    description: t("pixels-journey-customer-service-description"),
    keywords: translatedKeywords,
    openGraph: {
      images: ['/opengraph-image.png']
    }
  };
}


export default async function CustomerService({params}: {params: any}) {
  const {locale} = params;
  const { t } = await initTranslations(locale, ['common']);
  return (
    <div className="flex flex-col py-6 dark:text-white">
       <h1 className="text-2xl-semi font-bold text-gray-900 text-center dark:text-white mt-10">
          {t("customer-service")}
        </h1>
        <CustomerServiceComponent/>
        <ContactUs/>
    </div>
  
  );
}
