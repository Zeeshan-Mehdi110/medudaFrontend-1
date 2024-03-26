import Head from 'next/head';
import Link from 'next/link';
import initTranslations from 'app/i18n';
import CustomerServiceComponent from '@modules/customer-service';
import ContactUs from '@modules/contact-us';

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
