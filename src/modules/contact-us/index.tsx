"use client"
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@medusajs/ui"

const ContactUs = () => {
  const [messageSent, setMessageSent] = useState(false);
  const { t } = useTranslation();

  const sendEmail = async (e:any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // Remember to replace '{yourFormId}' with your actual Formspree form ID
    const response = await fetch('https://formspree.io/f/meqwpwbb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setMessageSent(true);
    } else {
      console.error('Error sending message');
    }

    e.target.reset();
  };

  return (
    <div className="max-w-xl mx-auto p-4 dark:text-white text-black">
      <h2 className="text-xl font-semibold text-center mb-4">{t('contact-us-title')}</h2>
      {messageSent ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p>{t('contact-us-success-message')}</p>
        </div>
      ) : (
        <p className="mb-4">{t('contact-us-description')}</p>
      )}
      <form onSubmit={sendEmail} className="space-y-4">
        <div>
          <label htmlFor="name" className="block dark:text-white text-sm font-medium text-gray-700">{t('name')}</label>
          <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-2 h-8 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="email" className="block  dark:text-white text-sm font-medium text-gray-700">{t('email')}</label>
          <input type="email" name="email" id="email" required className="mt-1 block w-full border-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="message" className="block dark:text-white text-sm font-medium text-gray-700">{t('contact-us-message')}</label>
          <textarea name="message" id="message" rows={3} required className="mt-1 block w-full border-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>
        {/* <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        
        </button> */}
        <div className='w-full flex justify-center items-center'>
        <Button type='submit' className='min-w-[150px]'>{t('send')}</Button>
        </div>

      </form>
    </div>
  );
};

export default ContactUs;
