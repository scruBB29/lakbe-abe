import React from 'react';

function Policy() {
  return (
    <section className="mb-8 mx-20"> {/* Added horizontal margin */}
      <h3 className="font-bold text-xl">Unverified App Notice</h3>

      <section className="mt-4 mb-4">
        <h4 className="font-bold text-lg">Google Account Access Warning</h4>
        <p className="mt-2">
          Our application may prompt a warning from Google indicating that the app is not verified. This warning occurs because the app is requesting access to sensitive information within your Google Account, and Google requires additional verification to ensure the safety of data handling.
        </p>
      </section>

      <section className="mt-4 mb-4">
        <h4 className="font-bold text-lg">What This Means</h4>
        <p className="mt-2">
          The warning is shown when our app is not yet fully verified by Google. This verification involves Google's assessment of our app's data handling and security practices. Until the app is verified, you may see a warning indicating that the app has not been validated by Google.
        </p>
      </section>

      <section className="mt-4 mb-4">
        <h4 className="font-bold text-lg">Why We Need Access</h4>
        <p className="mt-2">
          Our app requests certain permissions, like access to your Google Calendar, to provide features such as booking reminders. These permissions are strictly used for the functionality you opt into, and we do not share or misuse your personal information.
        </p>
      </section>

      <section className="mt-4 mb-4">
        <h4 className="font-bold text-lg">Your Choices</h4>
        <ul className="list-disc list-inside mt-2">
          <li>
            <strong>Proceeding with Access:</strong> You can proceed with connecting your Google account despite the warning by clicking on the "Advanced" option and selecting "Proceed to [App Name] (unsafe)."
          </li>
          <li>
            <strong>Opting Out:</strong> You can choose not to grant access if you are not comfortable, and the app will still function without Google integration.
          </li>
        </ul>
      </section>

      <section className="mt-4 mb-4">
        <h4 className="font-bold text-lg">Data Security</h4>
        <p className="mt-2">
          We are committed to protecting your privacy and ensuring the security of your data. We are in the process of working with Google to complete the verification process. In the meantime, if you have any concerns or questions, please contact us at:
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
    </section>
  );
}

export default Policy;
