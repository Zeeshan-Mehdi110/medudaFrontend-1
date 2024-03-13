import Head from 'next/head';
import Link from 'next/link';

export default function CustomerService() {
  return (
    <div className="flex flex-col min-h-screen py-2">
      <Head>
        <title>Customer Service</title>
        <meta name="description" content="How can we help you?" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold">
          Customer Service
        </h1>
        <p className="mt-3 text-base">
          Welcome to our Customer Service page. How can we help you today?
        </p>
        
        <div className="mt-6">
          {/* <ul className="space-y-2">
            <li><Link href="/faq"><a className="text-blue-600 hover:underline">Frequently Asked Questions</a></Link></li>
            <li><Link href="/contact"><a className="text-blue-600 hover:underline">Contact Us</a></Link></li>
            <li><Link href="/support"><a className="text-blue-600 hover:underline">Support</a></Link></li>
          </ul> */}
        </div>
      </main>
    </div>
  );
}
