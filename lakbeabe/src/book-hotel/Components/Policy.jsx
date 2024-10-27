import React from 'react';

function Policy() {
  return (
    <div className="w-screen px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="font-bold text-3xl">Privacy Policy Statement</h2>
      <div className="text-lg">
        <p className="mt-4">
          <strong>Effective Date:</strong> OCTOBER 28, 2024
        </p>
        <p>
          <strong>Last Updated:</strong> OCTOBER 28, 2024
        </p>

        <hr className="my-6 border-t-2 border-gray-300" />

        <section className="mb-8">
          <h3 className="font-bold text-xl">1. Introduction</h3>
          <p className="mt-2">
            Welcome to Lakbeabe ("we," "us," or "our"). This Privacy Policy explains how we collect, use, and protect your personal information when you use our services, including when you choose to receive booking reminders on your Google Calendar.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-xl">2. Information We Collect</h3>
          <p className="mt-2">
            When you use our services and opt-in to receive booking reminders on your Google Calendar, we may collect the following information:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>
              <strong>Personal Information:</strong> This includes your name, email address, and any other information you provide during the booking process.
            </li>
            <li>
              <strong>Google Calendar Access:</strong> When you check the checkbox to "Remind me the booking on my Google Calendar," we will request access to your Google Calendar to create events and reminders.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-xl">3. How We Use Your Information</h3>
          <ul className="list-disc list-inside mt-2">
            <li>
              <strong>Booking Reminders:</strong> To create and manage booking reminders on your Google Calendar when you opt-in to this service.
            </li>
            <li>
              <strong>Service Improvement:</strong> To improve our services and enhance your user experience.
            </li>
            <li>
              <strong>Communication:</strong> To communicate with you regarding your bookings and any updates to our services.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-xl">4. Sharing Your Information</h3>
          <p className="mt-2">
            We do not share your personal information with third parties except in the following circumstances:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>
              <strong>Google Calendar:</strong> When you opt-in to receive booking reminders, we will share necessary information with Google to create events on your Google Calendar.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights and safety.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-xl">5. Data Security</h3>
          <p className="mt-2">
            We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it from unauthorized access, disclosure, alteration, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-xl">6. Your Choices</h3>
          <ul className="list-disc list-inside mt-2">
            <li>
              <strong>Google Calendar Access:</strong> You can revoke our access to your Google Calendar at any time through your Google account settings.
            </li>
            <li>
              <strong>Communication Preferences:</strong> You can opt-out of receiving non-essential communications by adjusting your account settings or contacting us directly.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-xl">7. Changes to This Privacy Policy</h3>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this Privacy Policy periodically.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-xl">8. Contact Us</h3>
          <p className="mt-2">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <address className="mt-4">
            Lakbeabe <br />
            099999999 <br />
            Holy Angel University <br />
            lakbeabe@booktrip.com<br />
            123456789
          </address>
        </section>

        <hr className="my-6 border-t-2 border-gray-300" />

        <p className="mt-6">
          By using our services and opting in to receive booking reminders on your Google Calendar, you agree to the terms outlined in this Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Policy;
