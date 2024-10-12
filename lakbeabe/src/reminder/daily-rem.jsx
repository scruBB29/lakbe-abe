// src/components/TravelReminder.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const TravelReminder = () => {
  const [plan, setPlan] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Check if today's date is 1 week before the travel date
  const isOneWeekBefore = (travelDate) => {
    const today = new Date();
    const oneWeekBefore = new Date(travelDate);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

    // Compare dates without time
    return (
      today.toISOString().split('T')[0] ===
      oneWeekBefore.toISOString().split('T')[0]
    );
  };

  // Fetch the closest upcoming travel plan
  const fetchTravelPlan = async () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    try {
      const docRef = doc(db, 'travelPlans', today); // Replace with the travel date document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && isOneWeekBefore(docSnap.id)) {
        setPlan(docSnap.data().plan);
        setIsOpen(true); // Show the popup if the travel is in 7 days
      } else {
        console.log('No upcoming travel reminders for today.');
      }
    } catch (error) {
      console.error('Error fetching travel plan:', error);
    }
  };

  useEffect(() => {
    fetchTravelPlan();
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Travel Reminder</h2>
            <p className="text-gray-700 mb-6">
              {plan ? plan : 'No travel plans found.'}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TravelReminder;
// prototype (not yet final)